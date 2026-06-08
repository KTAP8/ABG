import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { errorHandler } from './middleware/errorHandler'
import dropsRouter from './routes/drops'
import productsRouter from './routes/products'
import waitlistRouter from './routes/waitlist'
import adminRouter from './routes/admin/index'

const app = express()

const corsOrigin = process.env.WEB_URL || 'http://localhost:5173'

app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(express.json())

// Routes
app.use('/api/drops', dropsRouter)
app.use('/api/products', productsRouter)
app.use('/api/waitlist', waitlistRouter)
app.use('/api/admin', adminRouter)

// Error handler (must be last)
app.use(errorHandler)

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`ABG server running on :${port}`)
})
