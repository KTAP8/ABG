import { Resend } from 'resend'

export function createEmailClient(apiKey: string) {
  return new Resend(apiKey)
}

export async function sendThankYouDiscountEmail(
  client: Resend,
  fromEmail: string,
  to: string,
  webUrl: string,
  data: { name: string; discountCode: string; discountPercent: number }
) {
  const fontStack = "'Helvetica Neue', Helvetica, Arial, sans-serif"
  const cream = '#F5F1E8'
  const charcoal = '#3F3F44'
  const charcoal70 = 'rgba(63, 63, 68, 0.7)'
  const charcoal50 = 'rgba(63, 63, 68, 0.5)'
  const hairline = 'rgba(63, 63, 68, 0.15)'
  const logoUrl = `${webUrl.replace(/\/$/, '')}/logos/abg_logo_grey.svg`

  return client.emails.send({
    from: fromEmail,
    to,
    subject: 'your supporter code for drop 02',
    html: `
      <div style="font-family: ${fontStack}; max-width: 560px; margin: 0 auto; padding: 48px 24px 56px; background-color: ${cream}; color: ${charcoal};">
        <img
          src="${logoUrl}"
          alt="abg"
          width="54"
          height="34"
          style="display: block; width: 54px; height: auto; margin: 0 0 40px; border: 0;"
        />

        <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.5; letter-spacing: -0.04em;">
          hey ${data.name},
        </p>

        <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.5; letter-spacing: -0.04em;">
          you backed the first drop. this is our thank you — a one-time code for drop 02.
        </p>

        <p style="margin: 0 0 32px; font-size: 14px; line-height: 1.5; letter-spacing: -0.04em; color: ${charcoal70};">
          ${data.discountPercent}% off. use it once. don't tell anyone.
        </p>

        <div style="border-top: 1px solid ${hairline}; border-bottom: 1px solid ${hairline}; padding: 28px 0; margin: 0 0 32px;">
          <p style="margin: 0 0 8px; font-size: 11px; line-height: 1.4; letter-spacing: -0.04em; color: ${charcoal50}; text-transform: lowercase;">
            your code
          </p>
          <p style="margin: 0; font-size: 28px; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; color: ${charcoal};">
            ${data.discountCode}
          </p>
        </div>

        <p style="margin: 0 0 32px; font-size: 13px; line-height: 1.5; letter-spacing: -0.04em; color: ${charcoal70};">
          one-time use. save it somewhere safe.
        </p>

        <div style="border-top: 1px solid ${hairline}; padding-top: 24px;">
          <p style="margin: 0 0 4px; font-size: 14px; line-height: 1.5; letter-spacing: -0.04em; color: ${charcoal70};">
            see you at the next drop,
          </p>
          <p style="margin: 0; font-size: 14px; line-height: 1.5; letter-spacing: -0.04em; color: ${charcoal};">
            abg
          </p>
        </div>
      </div>
    `,
  })
}
