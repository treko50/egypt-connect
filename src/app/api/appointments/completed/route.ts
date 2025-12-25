import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/appointments/completed - Get completed appointments for follow-up selector
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from Supabase
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, role')
      .eq('clerk_id', userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user: { id: string; role: string } = userData

    // Only clients should call this endpoint for booking follow-ups
    if (user.role !== 'client') {
      return NextResponse.json(
        { error: 'This endpoint is only for clients' },
        { status: 403 }
      )
    }

    // Get completed appointments for this user
    const { data: appointments, error } = await supabaseAdmin
      .from('appointments')
      .select(`
        id,
        title,
        start_time,
        consultation_type,
        assigned_judge:users!assigned_judge_id (
          first_name,
          last_name,
          judge_title
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('start_time', { ascending: false })

    if (error) {
      console.error('Error fetching completed appointments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch completed appointments' },
        { status: 500 }
      )
    }

    return NextResponse.json({ appointments: appointments || [] })
  } catch (error) {
    console.error('Error in GET /api/appointments/completed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
