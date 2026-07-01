import { Resend } from 'resend'

export function createEmailClient(apiKey: string) {
  return new Resend(apiKey)
}

export async function sendIykykConfirmationEmail(
  client: Resend,
  fromEmail: string,
  to: string,
  data: { name: string; discountCode: string; discountAmount: number }
) {
  return client.emails.send({
    from: fromEmail,
    to,
    subject: 'Your ABG Discount Code',
    html: `
      <div style="font-family: monospace; padding: 20px;">
        <p>Hey ${data.name},</p>
        <p>Thanks for joining the IYKYK club! Here's your exclusive discount code:</p>
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 0;">${data.discountCode}</p>
          <p style="margin-top: 10px; font-size: 14px; color: #666;">Worth ${data.discountAmount} THB off your next order</p>
        </div>
        <p style="font-size: 12px; color: #999;">This is a one-time use code. See you at the drop!</p>
      </div>
    `,
  })
}
