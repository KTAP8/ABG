/**
 * Same-origin proxy to PostHog EU. Keeps analytics requests first-party, so fewer
 * are lost to ad blockers. Can be replaced by PostHog's managed proxy once the
 * site has a custom domain.
 */
const INGEST_HOST = 'eu.i.posthog.com'
const ASSET_HOST = 'eu-assets.i.posthog.com'

export const onRequest = async ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const path = url.pathname.replace(/^\/ingest/, '') || '/'
  const isAsset = path.startsWith('/static/') || path.startsWith('/array/')
  const target = `https://${isAsset ? ASSET_HOST : INGEST_HOST}${path}${url.search}`

  const headers = new Headers(request.headers)
  headers.delete('cookie')
  const clientIp = request.headers.get('CF-Connecting-IP')
  if (clientIp) headers.set('X-Forwarded-For', clientIp)

  return fetch(target, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
  })
}
