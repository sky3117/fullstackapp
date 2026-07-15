import { Router } from 'express'
import Post from '../models/Post.js'
import { validatePostPayload } from '../utils/validatePost.js'

const postsRouter = Router()

postsRouter.get('/', async (_request, response, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean()
    response.json({ posts })
  } catch (error) {
    next(error)
  }
})

postsRouter.post('/', async (request, response, next) => {
  try {
    const validation = validatePostPayload(request.body)

    if (!validation.isValid) {
      return response.status(400).json({
        message: 'Validation failed.',
        validation
      })
    }

    const post = await Post.create({
      ...validation.normalizedData,
      validationSnapshot: {
        platformResults: validation.platformResults,
        validatedAt: new Date().toISOString()
      }
    })

    return response.status(201).json({
      message: 'Post created successfully.',
      post
    })
  } catch (error) {
    return next(error)
  }
})

export default postsRouter
