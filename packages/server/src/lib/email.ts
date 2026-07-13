import { Resend } from 'resend'

export function createEmailClient(apiKey: string) {
  return new Resend(apiKey)
}

export async function sendThankYouDiscountEmail(
  client: Resend,
  fromEmail: string,
  to: string,
  data: { name: string; discountCode: string; discountPercent: number }
) {
  return client.emails.send({
    from: fromEmail,
    to,
    subject: 'Thank you for supporting our first drop - Your exclusive discount code',
    html: `
      <div style="font-family: 'Courier New', Courier, monospace; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #000000; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 28px; font-weight: 900; letter-spacing: 4px; margin: 0; text-transform: uppercase;">ABG</h1>
          <p style="font-size: 12px; color: #888888; letter-spacing: 2px; margin-top: 5px;">DROP 02 EXCLUSIVE</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Hey ${data.name},</p>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Thank you for supporting our first drop. Your belief in us from the very beginning means everything.
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
          As a token of our appreciation, we've set aside a special discount exclusively for you to use on our second drop:
        </p>
        
        <div style="border: 1px solid #333333; background: #111111; padding: 32px; margin: 32px 0; text-align: center; border-radius: 4px;">
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0; color: #ffffff; font-family: monospace;">${data.discountCode}</p>
          <p style="margin: 16px 0 0 0; font-size: 14px; color: #888888; letter-spacing: 1px;">
            Enjoy ${data.discountPercent}% off your order
          </p>
        </div>
        
        <p style="font-size: 14px; line-height: 1.6; color: #888888; margin-top: 32px; border-top: 1px solid #222222; padding-top: 24px;">
          This is a one-time use code. It is our way of saying thanks for being here early.
        </p>
        
        <p style="font-size: 14px; line-height: 1.6; color: #ffffff; margin-bottom: 0;">
          See you at the next drop,
        </p>
        <p style="font-size: 14px; font-weight: bold; color: #ffffff; margin-top: 4px;">
          The ABG Team
        </p>
      </div>
    `,
  })
}
