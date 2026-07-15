import test from 'node:test'
import assert from 'node:assert/strict'
import { validatePostPayload } from '../src/utils/validatePost.js'

test('validates a correct post for X and LinkedIn', () => {
  const result = validatePostPayload({
    content: 'Launching today #buildinpublic',
    platforms: ['x', 'linkedin'],
    media: [{ type: 'image', name: 'cover.png', size: 1200 }]
  })

  assert.equal(result.isValid, true)
  assert.equal(result.platformResults.x.valid, true)
  assert.equal(result.platformResults.linkedin.valid, true)
})

test('blocks instagram posts when media is missing', () => {
  const result = validatePostPayload({
    content: 'New campaign update',
    platforms: ['instagram'],
    media: []
  })

  assert.equal(result.isValid, false)
  assert.match(result.platformResults.instagram.errors[0], /required/i)
})

test('blocks X posts with mixed image and video', () => {
  const result = validatePostPayload({
    content: 'Mixed media update',
    platforms: ['x'],
    media: [
      { type: 'image', name: 'cover.jpg', size: 4400 },
      { type: 'video', name: 'clip.mp4', size: 22000 }
    ]
  })

  assert.equal(result.isValid, false)
  assert.ok(result.platformResults.x.errors.some((error) => error.includes('either up to 4 images or 1 video')))
})
