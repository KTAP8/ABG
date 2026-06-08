import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resendFromEmail = process.env.RESEND_FROM_EMAIL

if (!resendApiKey || !resendFromEmail) {
  console.warn(
    'RESEND_API_KEY or RESEND_FROM_EMAIL not set. Email features will not work.',
  )
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null

export const getFromEmail = () => resendFromEmail || 'drop@abg.studio'
