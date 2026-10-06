const config = {
  active: {
    label: "აქტიური",
    wrapper: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
    dot: "bg-emerald-400",
    ping: "bg-emerald-400",
  },
  pending: {
    label: "მოლოდინში",
    wrapper: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/30",
    dot: "bg-yellow-400",
    ping: "bg-yellow-400",
  },
  cancelled: {
    label: "გაუქმებული",
    wrapper: "bg-red-500/10 text-red-400 ring-red-500/30",
    dot: "bg-red-400",
    ping: "bg-red-400",
  },
  info: {
    label: "ინფორმაცია",
    wrapper: "bg-blue-500/10 text-blue-400 ring-blue-500/30",
    dot: "bg-blue-400",
    ping: "bg-blue-400",
  },
} as const

type BadgeStatus = keyof typeof config

interface BadgeProps {
  status?: BadgeStatus
  label?: string
  pulse?: boolean
  className?: string
}

const Badge = ({ status = "info", label, pulse = true, className = "" }: BadgeProps) => {
  const { label: defaultLabel, wrapper, dot, ping } = config[status]

  return (
    <span
      className={`inline-flex items-center gap-x-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${wrapper} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${ping}`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dot}`} />
      </span>
      {label ?? defaultLabel}
    </span>
  )
}

export default Badge
