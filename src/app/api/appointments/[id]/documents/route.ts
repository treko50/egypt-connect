import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/appointments/[id]/documents - Get all documents for an appointment
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

    // Get appointment to check access
    const { data: appointmentData, error: apptError } = await supabaseAdmin
      .from('appointments')
      .select('user_id, assigned_judge_id')
      .eq('id', appointmentId)
      .single()

    if (apptError || !appointmentData) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    const appointment: { user_id: string; assigned_judge_id: string | null } = appointmentData

    // Check access permissions
    if (user.role === 'client' && appointment.user_id !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get documents
    const { data: documents, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('appointment_id', appointmentId)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Error fetching documents:', error)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    return NextResponse.json({ documents: documents || [] })
  } catch (error) {
    console.error('Error in GET /api/appointments/[id]/documents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/appointments/[id]/documents - Upload document to appointment
export async function POST(
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
    const { data: userData2, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, role')
      .eq('clerk_id', userId)
      .single()

    if (userError || !userData2) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user: { id: string; role: string } = userData2

    // Get appointment to check access
    const { data: appointmentData2, error: apptError } = await supabaseAdmin
      .from('appointments')
      .select('user_id, assigned_judge_id, start_time, status')
      .eq('id', appointmentId)
      .single()

    if (apptError || !appointmentData2) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    const appointment: { user_id: string; assigned_judge_id: string | null; start_time: string; status: string } = appointmentData2

    // Check access permissions
    if (user.role === 'client') {
      if (appointment.user_id !== user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      // Clients can only upload before appointment time
      const appointmentTime = new Date(appointment.start_time)
      const now = new Date()
      if (now > appointmentTime) {
        return NextResponse.json(
          { error: 'Cannot upload documents after appointment time' },
          { status: 400 }
        )
      }
    }

    const body = await request.json()
    const { name, type, file_url, file_size, mime_type, description } = body

    // Validate required fields
    if (!name || !file_url || !file_size || !mime_type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, file_url, file_size, mime_type' },
        { status: 400 }
      )
    }

    // Create document
    const { data: document, error } = await (supabaseAdmin
      .from('documents') as any)
      .insert({
        appointment_id: appointmentId,
        name,
        type: type || 'general',
        file_url,
        file_size,
        mime_type,
        uploaded_by: user.role,
        description: description || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating document:', error)
      return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
    }

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/appointments/[id]/documents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
