import { Router, type Router as ExpressRouter } from 'express'
import { requireAdmin } from '../../middleware/auth'

const router: ExpressRouter = Router()

// All admin routes protected by requireAdmin middleware
router.use(requireAdmin)

// Stub routes - actual implementation in phase 2
router.post('/login', (_req, res) => {
  res.status(401).json({ error: 'Not implemented' })
})

router.post('/logout', (_req, res) => {
  res.status(401).json({ error: 'Not implemented' })
})

router.get('/drops', (_req, res) => {
  res.status(401).json({ error: 'Not implemented' })
})

router.post('/drops', (_req, res) => {
  res.status(401).json({ error: 'Not implemented' })
})

router.patch('/drops/:id', (_req, res) => {
  res.status(401).json({ error: 'Not implemented' })
})

router.delete('/drops/:id', (_req, res) => {
  res.status(401).json({ error: 'Not implemented' })
})

router.get('/products', (_req, res) => {
  res.status(401).json({ error: 'Not implemented' })
})

router.post('/products', (_req, res) => {
  res.status(401).json({ error: 'Not implemented' })
})

router.patch('/products/:id', (_req, res) => {
  res.status(401).json({ error: 'Not implemented' })
})

router.delete('/products/:id', (_req, res) => {
  res.status(401).json({ error: 'Not implemented' })
})

router.post('/products/:id/images', (_req, res) => {
  res.status(401).json({ error: 'Not implemented' })
})

router.patch('/products/:id/stock', (_req, res) => {
  res.status(401).json({ error: 'Not implemented' })
})

router.get('/waitlist', (_req, res) => {
  res.status(401).json({ error: 'Not implemented' })
})

router.get('/waitlist/export', (_req, res) => {
  res.status(401).json({ error: 'Not implemented' })
})

router.post('/waitlist/blast', (_req, res) => {
  res.status(401).json({ error: 'Not implemented' })
})

export default router
