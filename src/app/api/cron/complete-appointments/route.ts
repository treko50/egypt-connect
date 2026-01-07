import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendCompletionEmail } from '@/lib/email/send-appointment-emails'

type AppointmentWithUser = {
  id: string
  title: string
  start_time: string
  end_time: string
  consultation_type: string
  judge_notes: string | null
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
    const now = new Date().toISOString()

    // Find confirmed appointments that have passed their end_time
    const { data: appointments, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select(`
        id,
        title,
        start_time,
        end_time,
        consultation_type,
        judge_notes,
        user:users!user_id (
          first_name,
          last_name,
          email
        )
      `)
      .eq('status', 'confirmed')
      .lt('end_time', now)
      .returns<AppointmentWithUser[]>()

    if (fetchError) {
      console.error('Error fetching appointments:', fetchError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!appointments || appointments.length === 0) {
      console.log('No appointments to complete')
      return NextResponse.json({
        message: 'No appointments to complete',
        completed: 0
      })
    }

    console.log(`Found ${appointments.length} appointments to complete`)

    // Get judge info (assuming single judge)
    const { data: judgeData } = await supabaseAdmin
      .from('users')
      .select('first_name, last_name')
      .eq('role', 'judge')
      .limit(1)
      .single()

    const judge = judgeData as { first_name: string; last_name: string } | null
    const judgeName = judge ? `${judge.first_name} ${judge.last_name}` : 'Your Legal Consultant'

    const completedIds: string[] = []
    const errors: Array<{ id: string; error: string }> = []

    // Process each appointment
    for (const appt of appointments) {
      try {
        // Update status to completed
        const { error: updateError } = await (supabaseAdmin
          .from('appointments') as any)
          .update({ status: 'completed' })
          .eq('id', appt.id)

        if (updateError) {
          console.error(`Failed to update appointment ${appt.id}:`, updateError)
          errors.push({ id: appt.id, error: updateError.message })
          continue
        }

        const user = appt.user
        const clientName = `${user.first_name} ${user.last_name}`

        const startDate = new Date(appt.start_time)
        const appointmentDate = startDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })

        // Send completion email
        await sendCompletionEmail({
          clientEmail: user.email,
          clientName,
          appointmentId: appt.id,
          appointmentTitle: appt.title,
          appointmentDate,
          consultationType: appt.consultation_type,
          judgeNotes: appt.judge_notes ?? undefined,
          judgeName,
        }).catch(emailError => {
          console.error(`Failed to send completion email for ${appt.id}:`, emailError)
          // Don't fail the whole operation for email errors
        })

        completedIds.push(appt.id)
        console.log(`Completed appointment ${appt.id}`)
      } catch (error) {
        console.error(`Error processing appointment ${appt.id}:`, error)
        errors.push({ id: appt.id, error: String(error) })
      }
    }

    return NextResponse.json({
      message: `Completed ${completedIds.length} appointments`,
      completed: completedIds.length,
      completedIds,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Cron job failed', details: String(error) },
      { status: 500 }
    )
  }
}

// Disable body parsing and set runtime
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
