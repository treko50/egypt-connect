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

interface FollowUpRequestProps {
  clientName: string
  originalAppointmentTitle: string
  originalAppointmentDate: string
  judgeNotes?: string
  judgeName: string
}

export function FollowUpRequest({
  clientName,
  originalAppointmentTitle,
  originalAppointmentDate,
  judgeNotes,
  judgeName,
}: FollowUpRequestProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return (
    <Html>
      <Head />
      <Preview>Follow-up consultation recommended - {originalAppointmentTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Follow-Up Consultation Recommended</Heading>

          <Text style={text}>Dear {clientName},</Text>

          <Text style={text}>
            Following your recent consultation on <strong>{originalAppointmentDate}</strong>
            regarding &ldquo;{originalAppointmentTitle}&rdquo;, {judgeName} recommends scheduling a
            follow-up session to continue assisting with your legal matter.
          </Text>

          {judgeNotes && (
            <Section style={notesSection}>
              <Text style={detailLabel}>Notes from {judgeName}:</Text>
              <Text style={notesText}>{judgeNotes}</Text>
            </Section>
          )}

          <Hr style={hr} />

          <Section style={buttonSection}>
            <Text style={text}>
              Schedule your follow-up consultation at a discounted rate:
            </Text>
            <Button style={button} href={`${appUrl}/booking?type=followUp`}>
              Schedule Follow-Up
            </Button>
          </Section>

          <Text style={text}>
            Follow-up consultations are available at a special rate and allow us to
            continue working on your case with full context from our previous discussion.
          </Text>

          <Text style={smallText}>
            If you have any questions, please don&apos;t hesitate to reach out.
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
  backgroundColor: '#fff8e6',
  borderLeft: '4px solid #ffcc00',
  margin: '24px 40px',
}

const notesText = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '8px 0',
  fontStyle: 'italic',
}

const detailLabel = {
  color: '#666',
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

export default FollowUpRequest
