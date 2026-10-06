import { CircleCheck, Info, TriangleAlert, X } from "lucide-react"


const config = {
  warning: {
    icon: TriangleAlert,
    button: "bg-yellow-600/50",
    box: "border-yellow-600 bg-yellow-700/40 shadow-yellow-700/50",
    text: "text-yellow-950",
  },
  success: {
    icon: CircleCheck,
    button: "bg-green-600/50",
    box: "border-green-600 bg-green-700/40 shadow-green-700/50",
    text: "text-green-950",
  },
  info: {
    icon: Info,
    button: "bg-blue-600/50",
    box: "border-blue-600 bg-blue-700/40 shadow-blue-700/50",
    text: "text-blue-950",
  },
} as const

type ToastType = keyof typeof config

interface ToastProps {
  type?: ToastType
  result: string
  handleClick?: () => void
}

const Toast = ({ type = "info", result, handleClick }: ToastProps) => {
  const { icon: Icon, button, box, text } = config[type]
  return (
    <div className="relative max-w-100">
      <button
        onClick={handleClick}
        aria-label="Close"
        className={`w-6 h-6 flex items-center p-1 justify-center absolute right-0 -top-2 backdrop-blur-2xl rounded-full z-50 cursor-pointer ${button}`}
      >
        <X className="w-full" />
      </button>

      <div
        className={`p-2 flex items-center shadow-2xl gap-x-3 rounded-xl border backdrop-blur-2xl ${box}`}
      >
        <Icon className={`shrink-0 ${text}`} />
        <p className={`text-xs font-semibold ${result}`}>{result}</p>
      </div>
    </div>
  )
}

export default Toast
