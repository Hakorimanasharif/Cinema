interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "white"
  className?: string
}

export default function LoadingSpinner({ size = "md", color = "primary", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  }

  const colorClasses = {
    primary: "border-red-600 border-t-transparent",
    white: "border-white border-t-transparent",
  }

  return (
    <div className={`${className} flex items-center justify-center`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full border-4 animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}

