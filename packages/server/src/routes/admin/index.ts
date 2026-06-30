import { Hono } from 'hono'
import { requireAdmin } from '../../middleware/auth'
import type { Env } from '../../types'

const router = new Hono<Env>()

router.use('*', requireAdmin)

const notImplemented = (c: { json: (body: unknown, status: number) => Response }) =>
  c.json({ error: 'Not implemented' }, 401)

router.post('/login', notImplemented)
router.post('/logout', notImplemented)
router.get('/drops', notImplemented)
router.post('/drops', notImplemented)
router.patch('/drops/:id', notImplemented)
router.delete('/drops/:id', notImplemented)
router.get('/products', notImplemented)
router.post('/products', notImplemented)
router.patch('/products/:id', notImplemented)
router.delete('/products/:id', notImplemented)
router.post('/products/:id/images', notImplemented)
router.patch('/products/:id/stock', notImplemented)
router.get('/waitlist', notImplemented)
router.get('/waitlist/export', notImplemented)
router.post('/waitlist/blast', notImplemented)

export default router
