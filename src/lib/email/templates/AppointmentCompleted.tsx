import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface AppointmentCompletedProps {
  clientName: string
  appointmentTitle: string
  appointmentDate: string
  judgeNotes?: string
  judgeName: string
  appointmentId: string
}

export function AppointmentCompleted({
  clientName,
  appointmentTitle,
  appointmentDate,
  judgeNotes,
  appointmentId,
}: AppointmentCompletedProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return (
    <Html>
      <Head />
      <Preview>Session summary: {appointmentTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Consultation Complete</Heading>

          <Text style={text}>Dear {clientName},</Text>

          <Text style={text}>
            Thank you for your consultation on <strong>{appointmentDate}</strong>
            regarding &ldquo;{appointmentTitle}&rdquo;.
          </Text>

          {judgeNotes && (
            <Section style={notesSection}>
              <Text style={detailLabel}>Session Summary & Recommendations:</Text>
              <Text style={notesText}>{judgeNotes}</Text>
            </Section>
          )}

          <Hr style={hr} />

          <Section style={buttonSection}>
            <Text style={text}>
              View your full session details and documents:
            </Text>
            <Button style={button} href={`${appUrl}/appointments/${appointmentId}`}>
              View Session Details
            </Button>
          </Section>

          <Text style={text}>
            If you need a follow-up consultation or have additional questions,
            please don&apos;t hesitate to schedule another session.
          </Text>

          <Text style={smallText}>
            We appreciate your trust in Egypt Connect Legal Services.
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

const notesSection = {
  padding: '24px 40px',
  backgroundColor: '#f0f7ff',
  borderLeft: '4px solid #0066cc',
  margin: '24px 40px',
}

const notesText = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '8px 0',
  whiteSpace: 'pre-wrap' as const,
}

const detailLabel = {
  color: '#0066cc',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px 0',
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

export default AppointmentCompleted
