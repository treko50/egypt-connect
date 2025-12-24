import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/appointments/[id] - Get single appointment with full details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: appointmentId } = await params

    // Get user from Supabase to check role
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, role')
      .eq('clerk_id', userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user: { id: string; role: string } = userData

    // Get appointment with all related data
    const { data: appointmentData, error } = await supabaseAdmin
      .from('appointments')
      .select(`
        *,
        user:users!appointments_user_id_fkey (
          id,
          first_name,
          last_name,
          email,
          phone,
          location
        ),
        assigned_judge:users!appointments_assigned_judge_id_fkey (
          id,
          first_name,
          last_name,
          judge_title,
          judge_bio
        ),
        parent_appointment:appointments!appointments_parent_appointment_id_fkey (
          id,
          title,
          start_time,
          status
        )
      `)
      .eq('id', appointmentId)
      .single()

    if (error || !appointmentData) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    const appointment: any = appointmentData

    // Check access permissions
    if (user.role === 'client' && appointment.user_id !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get documents for this appointment
    const { data: documents, error: docsError } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('appointment_id', appointmentId)
      .order('uploaded_at', { ascending: false })

    if (docsError) {
      console.error('Error fetching documents:', docsError)
    }

    // If it's a follow-up, also get parent appointment documents
    let parentDocuments = null
    if (appointment.parent_appointment_id) {
      const { data: parentDocs } = await supabaseAdmin
        .from('documents')
        .select('*')
        .eq('appointment_id', appointment.parent_appointment_id)
        .order('uploaded_at', { ascending: false })

      parentDocuments = parentDocs || []
    }

    // Filter internal notes for clients
    const responseData = {
      ...appointment,
      documents: documents || [],
      parentDocuments,
    }

    if (user.role === 'client') {
      delete responseData.internal_notes
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error in GET /api/appointments/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/appointments/[id] - Update appointment (status, notes, etc.)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: appointmentId } = await params

    // Get user from Supabase to check role
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, role')
      .eq('clerk_id', userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user: { id: string; role: string } = userData

    // Get existing appointment
    const { data: existingApptData, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select('user_id, assigned_judge_id')
      .eq('id', appointmentId)
      .single()

    if (fetchError || !existingApptData) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    const existingAppt: { user_id: string; assigned_judge_id: string | null } = existingApptData

    const body = await request.json()
    const { status, client_notes, judge_notes, internal_notes } = body

    // Build update object based on role
    const updates: any = {}

    if (user.role === 'client') {
      // Clients can only update their own appointments
      if (existingAppt.user_id !== user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      // Clients can only update client_notes
      if (client_notes !== undefined) {
        updates.client_notes = client_notes
      }
    } else if (user.role === 'judge') {
      // Judges can update status, judge_notes, and internal_notes
      if (status !== undefined) {
        updates.status = status
      }
      if (judge_notes !== undefined) {
        updates.judge_notes = judge_notes
      }
      if (internal_notes !== undefined) {
        updates.internal_notes = internal_notes
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    // Update appointment
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Supabase type inference issue
    const { data: appointment, error } = await (supabaseAdmin
      .from('appointments') as any)
      .update(updates)
      .eq('id', appointmentId)
      .select()
      .single()

    if (error) {
      console.error('Error updating appointment:', error)
      return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 })
    }

    // Filter internal notes for clients
    if (user.role === 'client') {
      delete appointment.internal_notes
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error in PATCH /api/appointments/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
