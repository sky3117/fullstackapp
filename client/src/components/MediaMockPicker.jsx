const formatBytes = (size) => {
  if (!size) {
    return '0 B'
  }
  const units = ['B', 'KB', 'MB', 'GB']
  const unitIndex = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1)
  const value = size / 1024 ** unitIndex
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

const MediaMockPicker = ({ media, onPick, onRemove }) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-200">Local media mock</label>
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={onPick}
        className="w-full rounded-xl border border-dashed border-white/30 bg-white/5 px-3 py-2 text-sm text-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-sky-400"
      />
      <div className="space-y-2">
        {media.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium text-slate-100">{item.name}</p>
              <p className="text-xs text-slate-400">
                {item.type.toUpperCase()} • {formatBytes(item.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="rounded-lg border border-white/15 px-2 py-1 text-xs text-slate-300 hover:border-red-400/60 hover:text-red-200"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MediaMockPicker
