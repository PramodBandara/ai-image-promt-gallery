export function ImageCard({ url, prompt, model, uploader_email, uploader_role, featured }: { url: string; prompt?: string; model?: string; uploader_email?: string; uploader_role?: string; featured?: boolean }) {
  const promptText = prompt ?? "No prompt available";
  return (
  <div className="group mb-6 break-inside-avoid rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <div className="relative overflow-hidden">
      <img
        src={url}
        alt="AI Image"
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

      {featured && uploader_role === 'admin' && (
        <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          ⭐ Featured
        </div>
      )}
    </div>

    <div className="p-5">
      <p className="text-sm text-zinc-300 leading-relaxed line-clamp-2">
        {promptText}
      </p>

      <div className="flex items-center justify-between mt-4">
        <button
          className="text-xs font-medium text-white bg-zinc-800/80 backdrop-blur-md px-4 py-1.5 rounded-full hover:bg-zinc-700 transition"
          onClick={() => navigator.clipboard.writeText(promptText)}
        >
          Copy Prompt
        </button>

        {model && (
          <div className="bg-blue-600/90 text-white text-xs px-3 py-1 rounded-full font-medium shadow">
            {model}
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-zinc-400 flex items-center justify-between">
        {uploader_role === 'admin' ? (
          <span className="text-green-400 font-semibold">Admin</span>
        ) : (
          <span className="truncate max-w-[140px]">{uploader_email}</span>
        )}
      </div>
    </div>
  </div>
);
}