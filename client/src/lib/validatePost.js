const validatePostForPlatforms = ({ content, selectedPlatforms, media }) => {
  const text = typeof content === 'string' ? content.trim() : ''
  const platformResults = {}

  const imageCount = media.filter((item) => item.type === 'image').length
  const videoCount = media.filter((item) => item.type === 'video').length

  selectedPlatforms.forEach((platform) => {
    const errors = []
    const warnings = []

    if (text.length > platform.charLimit) {
      errors.push(`Content exceeds ${platform.charLimit} character limit.`)
    } else if (text.length >= Math.floor(platform.charLimit * 0.9)) {
      warnings.push('Approaching character limit.')
    }

    if (platform.mediaRequired && media.length === 0) {
      errors.push('At least one media attachment is required.')
    }

    if (media.length > platform.mediaRules.maxItems) {
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

    if (platform.id === 'x' && videoCount > 0 && imageCount > 0) {
      errors.push('X supports either up to 4 images or 1 video in a single post.')
    }

    platformResults[platform.id] = {
      valid: errors.length === 0,
      charCount: text.length,
      remainingChars: platform.charLimit - text.length,
      errors,
      warnings
    }
  })

  const globalErrors = []
  if (!text) {
    globalErrors.push('Post content is required.')
  }
  if (!selectedPlatforms.length) {
    globalErrors.push('Select at least one platform.')
  }

  return {
    isValid: globalErrors.length === 0 && Object.values(platformResults).every((item) => item.valid),
    globalErrors,
    platformResults
  }
}

export { validatePostForPlatforms }
