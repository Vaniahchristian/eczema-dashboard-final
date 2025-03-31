export default function Fallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-slate-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-sky-600 mb-4">Loading EczemaAI Dashboard...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
      </div>
    </div>
  )
}

