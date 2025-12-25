import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { render } from '@react-email/render'
import { ReactElement } from 'react'

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const FROM_EMAIL = process.env.AWS_SES_FROM_EMAIL || 'noreply@egyptconnect.com'
const FROM_NAME = process.env.AWS_SES_FROM_NAME || 'Egypt Connect'

export interface SendEmailParams {
  to: string
  subject: string
  component: ReactElement
  replyTo?: string
}

export async function sendEmail({ to, subject, component, replyTo }: SendEmailParams) {
  try {
    const html = await render(component)
    const text = await render(component, { plainText: true })

    const command = new SendEmailCommand({
      Source: `${FROM_NAME} <${FROM_EMAIL}>`,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: html,
            Charset: 'UTF-8',
          },
          Text: {
            Data: text,
            Charset: 'UTF-8',
          },
        },
      },
      ReplyToAddresses: replyTo ? [replyTo] : undefined,
    })

    const response = await sesClient.send(command)
    console.log('Email sent successfully:', { to, subject, messageId: response.MessageId })
    return { success: true, messageId: response.MessageId }
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
