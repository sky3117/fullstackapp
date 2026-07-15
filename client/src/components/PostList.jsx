const formatDate = (value) => new Date(value).toLocaleString()

const PostList = ({ posts }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-100">Recent posts</h2>
      {posts.length === 0 && (
        <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          No posts yet. Create your first post.
        </p>
      )}
      {posts.map((post) => (
        <article key={post._id} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {post.platforms.map((platform) => (
              <span
                key={`${post._id}-${platform}`}
                className="rounded-full border border-sky-400/30 bg-sky-500/20 px-2 py-0.5 text-xs text-sky-100"
              >
                {platform}
              </span>
            ))}
            <span className="ml-auto text-xs text-slate-400">{formatDate(post.createdAt)}</span>
          </div>
          <p className="whitespace-pre-wrap text-sm text-slate-100">{post.content}</p>
          {post.media.length > 0 && (
            <div className="mt-3 space-y-1 text-xs text-slate-300">
              {post.media.map((item, index) => (
                <p key={`${post._id}-${item.name}-${index}`}>
                  {item.type.toUpperCase()}: {item.name} ({Math.round(item.size / 1024)} KB)
                </p>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

export default PostList
