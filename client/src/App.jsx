import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PlatformSelector from './components/PlatformSelector'
import MediaMockPicker from './components/MediaMockPicker'
import ValidationPanel from './components/ValidationPanel'
import PostList from './components/PostList'
import { validatePostForPlatforms } from './lib/validatePost'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const mapFileToMedia = (file) => ({
  type: file.type.startsWith('video') ? 'video' : 'image',
  name: file.name,
  size: file.size
})

function App() {
  const [platforms, setPlatforms] = useState([])
  const [posts, setPosts] = useState([])
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [content, setContent] = useState('')
  const [media, setMedia] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')

  const selectedPlatformObjects = useMemo(
    () => platforms.filter((platform) => selectedPlatforms.includes(platform.id)),
    [platforms, selectedPlatforms]
  )

  const validation = useMemo(
    () => validatePostForPlatforms({ content, selectedPlatforms: selectedPlatformObjects, media }),
    [content, selectedPlatformObjects, media]
  )

  const fetchPlatforms = async () => {
    const response = await fetch(`${API_BASE_URL}/api/platforms`)
    const data = await response.json()
    setPlatforms(data.platforms || [])
  }

  const fetchPosts = async () => {
    const response = await fetch(`${API_BASE_URL}/api/posts`)
    const data = await response.json()
    setPosts(data.posts || [])
  }

  useEffect(() => {
    fetchPlatforms().catch(() => setFeedback('Failed to load platform definitions.'))
    fetchPosts().catch(() => setFeedback('Failed to load posts.'))
  }, [])

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((previous) =>
      previous.includes(platformId)
        ? previous.filter((item) => item !== platformId)
        : [...previous, platformId]
    )
  }

  const handleMediaPick = (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) {
      return
    }

    setMedia((previous) => [...previous, ...files.map(mapFileToMedia)])
    event.target.value = ''
  }

  const handleRemoveMedia = (index) => {
    setMedia((previous) => previous.filter((_item, itemIndex) => itemIndex !== index))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFeedback('')

    if (!validation.isValid) {
      setFeedback('Please fix validation issues before submitting.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          platforms: selectedPlatforms,
          media
        })
      })

      const data = await response.json()

      if (!response.ok) {
        const serverErrors = data.validation?.globalErrors || [data.message]
        setFeedback(serverErrors.join(' '))
        return
      }

      setContent('')
      setSelectedPlatforms([])
      setMedia([])
      setFeedback('Post created successfully.')
      setPosts((previous) => [data.post, ...previous])
    } catch {
      setFeedback('Something went wrong while creating the post.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(217,70,239,0.16),transparent_40%)]" />

      <main className="relative mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1.2fr_1fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Social Composer Pro</h1>
              <p className="text-sm text-slate-300">Create one post, validate across multiple platforms.</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-sky-500/40 to-fuchsia-500/40" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="post-content" className="text-sm font-medium text-slate-200">
                Post content
              </label>
              <textarea
                id="post-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={7}
                placeholder="Write your message..."
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400/70"
              />
            </div>

            <PlatformSelector
              platforms={platforms}
              selectedPlatforms={selectedPlatforms}
              onToggle={togglePlatform}
            />

            <MediaMockPicker media={media} onPick={handleMediaPick} onRemove={handleRemoveMedia} />

            {feedback && (
              <p className={`rounded-xl px-3 py-2 text-sm ${feedback.includes('successfully') ? 'bg-emerald-500/20 text-emerald-200' : 'bg-red-500/20 text-red-200'}`}>
                {feedback}
              </p>
            )}

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Publishing...' : 'Create post'}
            </motion.button>
          </form>
        </motion.section>

        <section className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.35 }}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
          >
            <ValidationPanel
              selectedPlatformObjects={selectedPlatformObjects}
              validation={validation}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
          >
            <PostList posts={posts} />
          </motion.div>
        </section>
      </main>
    </div>
  )
}

export default App
