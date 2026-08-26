export default function Badge({ className = '', children, dotClassName }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${className}`}
    >
      {dotClassName && <span className={`h-1.5 w-1.5 rounded-full ${dotClassName}`} />}
      {children}
    </span>
  )
}
