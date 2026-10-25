import { Resend } from 'resend'
import { abgLogoGreyPng } from './email-logo'

const logoCid = 'abg-logo'

function logoAttachment() {
  return {
    filename: 'abg-logo.png',
    content: abgLogoGreyPng,
    contentType: 'image/png',
    contentId: logoCid,
  }
}

export function createEmailClient(apiKey: string) {
  return new Resend(apiKey)
}

export async function sendThankYouDiscountEmail(
  client: Resend,
  fromEmail: string,
  to: string,
  data: { name: string; discountCode: string; discountPercent: number }
) {
  const fontStack = "'Helvetica Neue', Helvetica, Arial, sans-serif"
  const cream = '#F5F1E8'
  const charcoal = '#3F3F44'
  const charcoal70 = 'rgba(63, 63, 68, 0.7)'
  const charcoal50 = 'rgba(63, 63, 68, 0.5)'
  const hairline = 'rgba(63, 63, 68, 0.15)'

  return client.emails.send({
    from: fromEmail,
    to,
    subject: 'your supporter code for drop 02',
    attachments: [logoAttachment()],
    html: `
      <div style="font-family: ${fontStack}; max-width: 560px; margin: 0 auto; padding: 48px 24px 56px; background-color: ${cream}; color: ${charcoal};">
        <img
          src="cid:${logoCid}"
          alt="abg"
          width="54"
          height="34"
          style="display: block; width: 54px; height: auto; margin: 0 0 40px; border: 0;"
        />

        <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.5; letter-spacing: -0.04em;">
          hey ${data.name},
        </p>

        <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.5; letter-spacing: -0.04em;">
          you backed the first drop. this is our thank you. a one-time code for drop 02.
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendOrderConfirmationEmail(
  client: Resend,
  fromEmail: string,
  to: string,
  data: {
    orderRef: string
    subtotal: number
    discount: number
    shipping: number
    total: number
    shipTo: {
      name?: string | null
      line1?: string | null
      line2?: string | null
      city?: string | null
      state?: string | null
      postalCode?: string | null
      country?: string | null
      phone?: string | null
    }
    items: {
      name: string
      size: string
      color: string | null
      quantity: number
      unitPrice: number
      imageUrl: string | null
    }[]
  },
) {
  const fontStack = "'Helvetica Neue', Helvetica, Arial, sans-serif"
  const cream = '#F5F1E8'
  const charcoal = '#3F3F44'
  const charcoal70 = 'rgba(63, 63, 68, 0.7)'
  const charcoal50 = 'rgba(63, 63, 68, 0.5)'
  const hairline = 'rgba(63, 63, 68, 0.15)'
  const baht = (amount: number) => `฿${amount.toLocaleString('en-US')}`

  const itemRows = data.items
    .map((item) => {
      const variant = [item.color, item.size].filter(Boolean).join(' / ')
      const thumb = item.imageUrl
        ? `<img src="${escapeHtml(item.imageUrl)}" alt="" width="72" height="96" style="display: block; width: 72px; height: 96px; object-fit: cover; border: 0;" />`
        : ''
      return `
        <tr>
          <td width="72" valign="top" style="padding: 16px 0; border-top: 1px solid ${hairline};">
            ${thumb}
          </td>
          <td valign="top" style="padding: 16px 16px; border-top: 1px solid ${hairline}; font-family: ${fontStack}; font-size: 14px; line-height: 1.4; letter-spacing: -0.04em; color: ${charcoal};">
            ${escapeHtml(item.name)}
            <br />
            <span style="color: ${charcoal50}; font-size: 12px;">${escapeHtml(variant)}${variant ? ' · ' : ''}qty ${item.quantity}</span>
          </td>
          <td valign="top" align="right" style="padding: 16px 0; border-top: 1px solid ${hairline}; font-family: ${fontStack}; font-size: 14px; letter-spacing: -0.04em; color: ${charcoal};">
            ${baht(item.unitPrice * item.quantity)}
          </td>
        </tr>`
    })
    .join('')

  const moneyRow = (label: string, value: string, strong = false) => `
    <tr>
      <td style="padding: 4px 0; font-family: ${fontStack}; font-size: 14px; letter-spacing: -0.04em; color: ${strong ? charcoal : charcoal70};${strong ? ' font-weight: 700;' : ''}">
        ${label}
      </td>
      <td align="right" style="padding: 4px 0; font-family: ${fontStack}; font-size: 14px; letter-spacing: -0.04em; color: ${charcoal};${strong ? ' font-weight: 700;' : ''}">
        ${value}
      </td>
    </tr>`

  const cityLine = [data.shipTo.city, data.shipTo.state, data.shipTo.postalCode].filter(Boolean).join(' ')
  const addressLines = [
    data.shipTo.name,
    data.shipTo.line1,
    data.shipTo.line2,
    cityLine,
    data.shipTo.country,
    data.shipTo.phone,
  ].filter((line): line is string => Boolean(line && line.trim()))

  const addressHtml = addressLines
    .map(
      (line) =>
        `<p style="margin: 0; font-family: ${fontStack}; font-size: 14px; line-height: 1.5; letter-spacing: -0.04em; color: ${charcoal};">${escapeHtml(line)}</p>`,
    )
    .join('')

  return client.emails.send({
    from: fromEmail,
    to,
    subject: 'your abg order',
    attachments: [logoAttachment()],
    html: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${cream};">
        <tr>
          <td align="center" style="padding: 48px 24px 56px;">
            <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 560px;">
              <tr>
                <td style="padding: 0 0 40px;">
                  <img src="cid:${logoCid}" alt="abg" width="54" height="34" style="display: block; width: 54px; height: auto; border: 0;" />
                </td>
              </tr>
              <tr>
                <td style="padding: 0 0 8px; font-family: ${fontStack}; font-size: 15px; line-height: 1.5; letter-spacing: -0.04em; color: ${charcoal};">
                  we have your order. we'll email you when it ships.
                </td>
              </tr>
              <tr>
                <td style="padding: 0 0 28px; font-family: ${fontStack}; font-size: 12px; letter-spacing: -0.04em; color: ${charcoal50};">
                  ${escapeHtml(data.orderRef)}
                </td>
              </tr>
              <tr>
                <td>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${itemRows}
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 0 0; border-top: 1px solid ${hairline};">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${moneyRow('subtotal', baht(data.subtotal))}
                    ${data.discount > 0 ? moneyRow('discount', baht(data.discount)) : ''}
                    ${moneyRow('shipping', data.shipping === 0 ? 'free' : baht(data.shipping))}
                    ${moneyRow('total', baht(data.total), true)}
                  </table>
                </td>
              </tr>
              ${
                addressHtml
                  ? `<tr>
                <td style="padding: 28px 0 0;">
                  <p style="margin: 0 0 8px; font-family: ${fontStack}; font-size: 11px; letter-spacing: -0.04em; color: ${charcoal50};">ship to</p>
                  ${addressHtml}
                </td>
              </tr>`
                  : ''
              }
              <tr>
                <td style="padding: 32px 0 0; border-top: 1px solid ${hairline};">
                  <p style="margin: 0 0 4px; font-family: ${fontStack}; font-size: 14px; line-height: 1.5; letter-spacing: -0.04em; color: ${charcoal};">abg</p>
                  <p style="margin: 0; font-family: ${fontStack}; font-size: 13px; line-height: 1.5; letter-spacing: -0.04em; color: ${charcoal70};">
                    <a href="mailto:touch.apinankul@gmail.com" style="color: ${charcoal70}; text-decoration: none;">touch.apinankul@gmail.com</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  })
}
