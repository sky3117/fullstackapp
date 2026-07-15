const PLATFORM_DEFINITIONS = [
  {
    id: 'x',
    name: 'X',
    charLimit: 280,
    hashtagsAllowed: true,
    mediaRequired: false,
    mediaRules: {
      maxItems: 4,
      allowedTypes: ['image', 'video'],
      maxImages: 4,
      maxVideos: 1,
      imageOnly: false
    }
  },
  {
    id: 'instagram',
    name: 'Instagram',
    charLimit: 2200,
    hashtagsAllowed: true,
    mediaRequired: true,
    mediaRules: {
      maxItems: 10,
      allowedTypes: ['image', 'video'],
      maxImages: 10,
      maxVideos: 10,
      imageOnly: false
    }
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    charLimit: 3000,
    hashtagsAllowed: true,
    mediaRequired: false,
    mediaRules: {
      maxItems: 9,
      allowedTypes: ['image'],
      maxImages: 9,
      maxVideos: 0,
      imageOnly: true
    }
  }
]

const PLATFORM_MAP = PLATFORM_DEFINITIONS.reduce((accumulator, platform) => {
  accumulator[platform.id] = platform
  return accumulator
}, {})

export { PLATFORM_DEFINITIONS, PLATFORM_MAP }
