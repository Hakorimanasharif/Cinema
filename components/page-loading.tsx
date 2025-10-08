import LoadingSpinner from "./loading-spinner"

export default function PageLoading() {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="lg" color="primary" />
        <p className="mt-4 text-xl font-medium">Loading...</p>
      </div>
    </div>
  )
}

