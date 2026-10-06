import { useEffect, type ReactNode } from "react"
import { TriangleAlert } from "lucide-react"

interface ModalProps {
  open: boolean
  title?: string
  children?: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel: () => void
}

const Modal = ({
  open,
  title = "გაფრთხილება",
  children,
  confirmText = "წაშლა",
  cancelText = "გაუქმება",
  onConfirm,
  onCancel,
}: ModalProps) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-[#BBCABF]/20 bg-[#070F21] p-6 shadow-2xl shadow-black/50"
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15">
            <TriangleAlert className="text-red-500" size={24} />
          </div>
          <h3 id="modal-title" className="mt-4 text-lg font-bold text-white">
            {title}
          </h3>
        </div>

        <div className="mt-3 space-y-2 text-center text-sm">{children}</div>

        <div className="mt-6 flex items-center justify-end gap-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-md border border-[#BBCABF]/30 px-4 py-2 text-sm font-semibold text-[#BBCABF] transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BBCABF]"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
