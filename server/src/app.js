import cors from 'cors'
import express from 'express'
import platformsRouter from './routes/platforms.js'
import postsRouter from './routes/posts.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.use('/api/platforms', platformsRouter)
app.use('/api/posts', postsRouter)

app.use((error, _request, response, _next) => {
  const statusCode = error.statusCode || 500
  response.status(statusCode).json({
    message: error.message || 'Internal server error.'
  })
})

export default app
