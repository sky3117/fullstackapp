const ValidationPanel = ({ selectedPlatformObjects, validation }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-slate-200">Validation status</h2>
      {validation.globalErrors.length > 0 && (
        <div className="rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
          {validation.globalErrors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
      <div className="space-y-2">
        {selectedPlatformObjects.map((platform) => {
          const platformState = validation.platformResults[platform.id]
          if (!platformState) {
            return null
          }

          return (
            <div
              key={platform.id}
              className={`rounded-xl border p-3 text-sm ${
                platformState.valid
                  ? 'border-emerald-400/30 bg-emerald-500/10'
                  : 'border-amber-400/35 bg-amber-500/10'
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-4">
                <p className="font-medium text-slate-100">{platform.name}</p>
                <p className="text-xs text-slate-300">
                  {platformState.charCount}/{platform.charLimit}
                </p>
              </div>
              <p className="text-xs text-slate-300">
                Remaining characters: <strong>{platformState.remainingChars}</strong>
              </p>
              {platformState.warnings.map((warning) => (
                <p key={warning} className="mt-1 text-xs text-amber-200">
                  {warning}
                </p>
              ))}
              {platformState.errors.map((error) => (
                <p key={error} className="mt-1 text-xs text-red-200">
                  {error}
                </p>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ValidationPanel
