import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PlatformSelector = ({ platforms, selectedPlatforms, onToggle }) => {
  const [open, setOpen] = useState(false)
  const selectedNames = platforms
    .filter((platform) => selectedPlatforms.includes(platform.id))
    .map((platform) => platform.name)

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-200">Platforms</label>
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 transition hover:border-white/25"
      >
        <span className="truncate">
          {selectedNames.length ? selectedNames.join(', ') : 'Select one or more platforms'}
        </span>
        <span className="text-xs text-slate-400">{open ? 'Hide' : 'Show'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="grid gap-2 rounded-xl border border-white/10 bg-slate-900/80 p-2 sm:grid-cols-3"
          >
            {platforms.map((platform) => {
              const selected = selectedPlatforms.includes(platform.id)
              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => onToggle(platform.id)}
                  className={`rounded-lg border px-3 py-2 text-left transition ${
                    selected
                      ? 'border-sky-400 bg-sky-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25'
                  }`}
                >
                  <div className="font-medium capitalize">{platform.name}</div>
                  <div className="text-xs text-slate-400">Limit {platform.charLimit}</div>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-wrap gap-2">
        {selectedNames.map((name) => (
          <span
            key={name}
            className="rounded-full border border-sky-400/30 bg-sky-500/20 px-2 py-0.5 text-xs text-sky-100"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default PlatformSelector
