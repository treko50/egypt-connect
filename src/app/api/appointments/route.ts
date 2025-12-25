import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/appointments - Get appointments based on user role
export async function GET(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = supabaseAdmin
      .from('appointments')
      .select(`
        *,
        user:users!user_id (
          id,
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .order('start_time', { ascending: false })

    // Filter based on role
    if (user.role === 'client') {
      // Clients only see their own appointments
      query = query.eq('user_id', user.id)
    } else if (user.role === 'judge') {
      // Judges see all appointments or filter by assigned
      const assignedOnly = searchParams.get('assignedOnly')
      if (assignedOnly === 'true') {
        query = query.eq('assigned_judge_id', user.id)
      }
    }

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (startDate) {
      query = query.gte('start_time', startDate)
    }

    if (endDate) {
      query = query.lte('start_time', endDate)
    }

    const { data: appointments, error } = await query

    if (error) {
      console.error('Error fetching appointments:', error)
      return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
    }

    return NextResponse.json({ appointments, userRole: user.role })
  } catch (error) {
    console.error('Error in GET /api/appointments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/appointments - Create new appointment
export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from Supabase
    const { data: userData2, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, role')
      .eq('clerk_id', userId)
      .single()

    if (userError || !userData2) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user: { id: string; role: string } = userData2

    const body = await request.json()
    const {
      title,
      description,
      start_time,
      end_time,
      consultation_type = 'initial',
      client_notes,
      parent_appointment_id,
    } = body

    // Validate required fields
    if (!title || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Missing required fields: title, start_time, end_time' },
        { status: 400 }
      )
    }

    // Validate follow-up appointments
    if (consultation_type === 'followUp') {
      if (!parent_appointment_id) {
        return NextResponse.json(
          { error: 'Follow-up appointments require parent_appointment_id' },
          { status: 400 }
        )
      }

      // Check if parent appointment is completed
      const { data: parentApptData, error: parentError } = await supabaseAdmin
        .from('appointments')
        .select('id, status, user_id')
        .eq('id', parent_appointment_id)
        .single()

      if (parentError || !parentApptData) {
        return NextResponse.json(
          { error: 'Parent appointment not found' },
          { status: 404 }
        )
      }

      const parentAppt: { id: string; status: string; user_id: string } = parentApptData

      if (parentAppt.status !== 'completed') {
        return NextResponse.json(
          { error: 'Follow-up appointments can only be booked after completing the initial consultation' },
          { status: 400 }
        )
      }

      if (parentAppt.user_id !== user.id) {
        return NextResponse.json(
          { error: 'Parent appointment does not belong to this user' },
          { status: 403 }
        )
      }
    }

    // Create appointment
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Supabase type inference issue
    const { data: appointment, error } = await (supabaseAdmin
      .from('appointments') as any)
      .insert({
        user_id: user.id,
        title,
        description,
        start_time,
        end_time,
        consultation_type,
        client_notes,
        parent_appointment_id: parent_appointment_id || null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating appointment:', error)
      return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
    }

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/appointments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
