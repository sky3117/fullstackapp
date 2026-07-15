import { Router } from 'express'
import { PLATFORM_DEFINITIONS } from '../config/platforms.js'

const platformsRouter = Router()

platformsRouter.get('/', (_request, response) => {
  response.json({ platforms: PLATFORM_DEFINITIONS })
})

export default platformsRouter
