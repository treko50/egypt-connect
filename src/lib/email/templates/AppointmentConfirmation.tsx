import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface AppointmentConfirmationProps {
  clientName: string
  appointmentTitle: string
  appointmentDate: string
  appointmentTime: string
  meetingUrl: string
  consultationType: string
  judgeNotes?: string
  appointmentId: string
}

export function AppointmentConfirmation({
  clientName,
  appointmentTitle,
  appointmentDate,
  appointmentTime,
  meetingUrl,
  consultationType,
  judgeNotes,
  appointmentId,
}: AppointmentConfirmationProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return (
    <Html>
      <Head />
      <Preview>Your appointment has been confirmed - {appointmentTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Appointment Confirmed</Heading>

          <Text style={text}>Dear {clientName},</Text>

          <Text style={text}>
            Your appointment has been confirmed. Here are the details:
          </Text>

          <Section style={appointmentDetails}>
            <Text style={detailLabel}>Appointment:</Text>
            <Text style={detailValue}>{appointmentTitle}</Text>

            <Text style={detailLabel}>Type:</Text>
            <Text style={detailValue}>{consultationType}</Text>

            <Text style={detailLabel}>Date:</Text>
            <Text style={detailValue}>{appointmentDate}</Text>

            <Text style={detailLabel}>Time:</Text>
            <Text style={detailValue}>{appointmentTime}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={buttonSection}>
            <Text style={text}>Join your virtual consultation:</Text>
            <Button style={button} href={meetingUrl}>
              Join Video Meeting
            </Button>
            <Text style={smallText}>
              Meeting Link: <Link href={meetingUrl}>{meetingUrl}</Link>
            </Text>
          </Section>

          {judgeNotes && (
            <>
              <Hr style={hr} />
              <Section>
                <Text style={detailLabel}>Notes from your legal consultant:</Text>
                <Text style={text}>{judgeNotes}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />

          <Text style={text}>
            You can view your appointment details anytime:{' '}
            <Link href={`${appUrl}/appointments/${appointmentId}`}>
              View Appointment
            </Link>
          </Text>

          <Text style={smallText}>
            If you need to cancel or reschedule, please contact us at least 24 hours in advance.
          </Text>

          <Text style={footer}>
            Egypt Connect Legal Services<br />
            Professional legal consultation you can trust
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
}

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
}

const appointmentDetails = {
  padding: '24px 40px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  margin: '24px 40px',
}

const detailLabel = {
  color: '#666',
  fontSize: '14px',
  fontWeight: '600',
  margin: '8px 0 4px 0',
}

const detailValue = {
  color: '#1a1a1a',
  fontSize: '16px',
  margin: '0 0 16px 0',
}

const buttonSection = {
  padding: '24px 40px',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#0066cc',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '16px 24px',
  margin: '16px 0',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 40px',
}

const smallText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
  padding: '0 40px',
  marginTop: '8px',
}

const footer = {
  color: '#999',
  fontSize: '14px',
  lineHeight: '22px',
  padding: '0 40px',
  marginTop: '32px',
}

export default AppointmentConfirmation
