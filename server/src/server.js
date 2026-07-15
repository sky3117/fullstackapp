import dotenv from 'dotenv'
import mongoose from 'mongoose'
import app from './app.js'

dotenv.config()

const port = Number(process.env.PORT || 5000)
const mongoUri = process.env.MONGODB_URI

const startServer = async () => {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set. Add it to your environment configuration.')
  }

  await mongoose.connect(mongoUri)

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message)
  process.exit(1)
})
