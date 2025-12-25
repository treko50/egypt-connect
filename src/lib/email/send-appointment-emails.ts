import { sendEmail } from './ses-client'
import { AppointmentConfirmation } from './templates/AppointmentConfirmation'
import { FollowUpRequest } from './templates/FollowUpRequest'
import { AppointmentReminder } from './templates/AppointmentReminder'
import { AppointmentCompleted } from './templates/AppointmentCompleted'

interface AppointmentEmailData {
  clientEmail: string
  clientName: string
  appointmentId: string
  appointmentTitle: string
  appointmentDate: string
  appointmentTime: string
  meetingUrl: string
  consultationType: string
  judgeNotes?: string
  judgeName: string
}

export async function sendConfirmationEmail(data: AppointmentEmailData) {
  return sendEmail({
    to: data.clientEmail,
    subject: `Appointment Confirmed: ${data.appointmentTitle}`,
    component: AppointmentConfirmation({
      clientName: data.clientName,
      appointmentTitle: data.appointmentTitle,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      meetingUrl: data.meetingUrl,
      consultationType: data.consultationType,
      judgeNotes: data.judgeNotes,
      appointmentId: data.appointmentId,
    }),
  })
}

export async function sendFollowUpRequestEmail(data: Omit<AppointmentEmailData, 'meetingUrl' | 'appointmentTime'>) {
  return sendEmail({
    to: data.clientEmail,
    subject: `Follow-Up Consultation Recommended: ${data.appointmentTitle}`,
    component: FollowUpRequest({
      clientName: data.clientName,
      originalAppointmentTitle: data.appointmentTitle,
      originalAppointmentDate: data.appointmentDate,
      judgeNotes: data.judgeNotes,
      judgeName: data.judgeName,
    }),
  })
}

export async function sendReminderEmail(data: AppointmentEmailData & { hoursUntil: number }) {
  return sendEmail({
    to: data.clientEmail,
    subject: `Reminder: Your appointment is in ${data.hoursUntil} hours`,
    component: AppointmentReminder({
      clientName: data.clientName,
      appointmentTitle: data.appointmentTitle,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      meetingUrl: data.meetingUrl,
      hoursUntil: data.hoursUntil,
    }),
  })
}

export async function sendCompletionEmail(data: Omit<AppointmentEmailData, 'meetingUrl' | 'appointmentTime'>) {
  return sendEmail({
    to: data.clientEmail,
    subject: `Session Summary: ${data.appointmentTitle}`,
    component: AppointmentCompleted({
      clientName: data.clientName,
      appointmentTitle: data.appointmentTitle,
      appointmentDate: data.appointmentDate,
      judgeNotes: data.judgeNotes,
      judgeName: data.judgeName,
      appointmentId: data.appointmentId,
    }),
  })
}
