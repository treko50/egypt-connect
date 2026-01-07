import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendReminderEmail } from '@/lib/email/send-appointment-emails'

type AppointmentWithUser = {
  id: string
  title: string
  start_time: string
  end_time: string
  meeting_url: string | null
  consultation_type: string
  user: {
    first_name: string
    last_name: string
    email: string
  }
}

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const in23Hours = new Date(now.getTime() + 23 * 60 * 60 * 1000)

    // Find confirmed appointments starting in 23-24 hours
    const { data: appointments, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select(`
        id,
        title,
        start_time,
        end_time,
        meeting_url,
        consultation_type,
        user:users!user_id (
          first_name,
          last_name,
          email
        )
      `)
      .eq('status', 'confirmed')
      .gte('start_time', in23Hours.toISOString())
      .lte('start_time', in24Hours.toISOString())
      .returns<AppointmentWithUser[]>()

    if (fetchError) {
      console.error('Error fetching appointments:', fetchError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!appointments || appointments.length === 0) {
      console.log('No reminders to send')
      return NextResponse.json({
        message: 'No reminders to send',
        sent: 0
      })
    }

    console.log(`Sending ${appointments.length} reminders`)

    // Get judge info
    const { data: judgeData } = await supabaseAdmin
      .from('users')
      .select('first_name, last_name')
      .eq('role', 'judge')
      .limit(1)
      .single()

    const judge = judgeData as { first_name: string; last_name: string } | null
    const judgeName = judge ? `${judge.first_name} ${judge.last_name}` : 'Your Legal Consultant'

    const sentIds: string[] = []
    const errors: Array<{ id: string; error: string }> = []

    for (const appt of appointments) {
      try {
        const user = appt.user
        const clientName = `${user.first_name} ${user.last_name}`

        const startDate = new Date(appt.start_time)
        const appointmentDate = startDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
        const appointmentTime = startDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })

        await sendReminderEmail({
          clientEmail: user.email,
          clientName,
          appointmentId: appt.id,
          appointmentTitle: appt.title,
          appointmentDate,
          appointmentTime,
          meetingUrl: appt.meeting_url || '',
          consultationType: appt.consultation_type,
          judgeName,
          hoursUntil: 24,
        })

        sentIds.push(appt.id)
        console.log(`Sent reminder for appointment ${appt.id}`)
      } catch (error) {
        console.error(`Failed to send reminder for ${appt.id}:`, error)
        errors.push({ id: appt.id, error: String(error) })
      }
    }

    return NextResponse.json({
      message: `Sent ${sentIds.length} reminders`,
      sent: sentIds.length,
      sentIds,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Reminder cron error:', error)
    return NextResponse.json(
      { error: 'Cron job failed', details: String(error) },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
