import { PLATFORM_MAP } from '../config/platforms.js'

const VALID_MEDIA_TYPES = new Set(['image', 'video'])

const formatMedia = (media = []) => media.map((item) => ({
  type: item.type,
  name: item.name,
  size: item.size,
  url: item.url
}))

const validatePostPayload = ({ content = '', platforms = [], media = [] }) => {
  const normalizedContent = typeof content === 'string' ? content : ''
  const trimmedContent = normalizedContent.trim()
  const normalizedPlatforms = Array.isArray(platforms) ? [...new Set(platforms)] : []
  const normalizedMedia = Array.isArray(media)
    ? media.filter((item) => item && VALID_MEDIA_TYPES.has(item.type))
    : []

  const result = {
    isValid: true,
    globalErrors: [],
    platformResults: {}
  }

  if (!trimmedContent) {
    result.globalErrors.push('Post content is required.')
  }

  if (!normalizedPlatforms.length) {
    result.globalErrors.push('Select at least one platform.')
  }

  const unknownPlatforms = normalizedPlatforms.filter((platformId) => !PLATFORM_MAP[platformId])
  if (unknownPlatforms.length) {
    result.globalErrors.push(`Unknown platform(s): ${unknownPlatforms.join(', ')}`)
  }

  const imageCount = normalizedMedia.filter((item) => item.type === 'image').length
  const videoCount = normalizedMedia.filter((item) => item.type === 'video').length

  normalizedPlatforms.forEach((platformId) => {
    const platform = PLATFORM_MAP[platformId]
    if (!platform) {
      return
    }

    const errors = []
    const warnings = []

    if (trimmedContent.length > platform.charLimit) {
      errors.push(`Content exceeds ${platform.charLimit} character limit.`)
    } else if (trimmedContent.length >= Math.floor(platform.charLimit * 0.9)) {
      warnings.push('Approaching character limit.')
    }

    const totalMediaCount = normalizedMedia.length

    if (platform.mediaRequired && totalMediaCount === 0) {
      errors.push('At least one media attachment is required.')
    }

    if (totalMediaCount > platform.mediaRules.maxItems) {
      errors.push(`Too many media files. Maximum ${platform.mediaRules.maxItems}.`)
    }

    if (platform.mediaRules.imageOnly && videoCount > 0) {
      errors.push('This platform supports only images.')
    }

    if (imageCount > platform.mediaRules.maxImages) {
      errors.push(`Too many images. Maximum ${platform.mediaRules.maxImages}.`)
    }

    if (videoCount > platform.mediaRules.maxVideos) {
      errors.push(`Too many videos. Maximum ${platform.mediaRules.maxVideos}.`)
    }

    if (platformId === 'x' && videoCount > 0 && imageCount > 0) {
      errors.push('X supports either up to 4 images or 1 video in a single post.')
    }

    result.platformResults[platformId] = {
      valid: errors.length === 0,
      charCount: trimmedContent.length,
      remainingChars: platform.charLimit - trimmedContent.length,
      errors,
      warnings
    }
  })

  if (Object.values(result.platformResults).some((platformResult) => !platformResult.valid)) {
    result.isValid = false
  }

  if (result.globalErrors.length) {
    result.isValid = false
  }

  return {
    ...result,
    normalizedData: {
      content: trimmedContent,
      platforms: normalizedPlatforms.filter((platformId) => PLATFORM_MAP[platformId]),
      media: formatMedia(normalizedMedia)
    }
  }
}

export { validatePostPayload }
