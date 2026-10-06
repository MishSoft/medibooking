import type { ReactNode } from "react"

interface ButtonProps {
  className?: string
  handleClick?: () => void
  type?: "button" | "submit" | "reset"
  children?: ReactNode
}


const Button = ({ className, handleClick, type="button", children }: ButtonProps) => {
  return (
    <button type={type} className={`p-2 w-full cursor-pointer rounded-md font-semibold ${className}`} onClick={handleClick} >
      {children}
    </button>
  )
}

export default Button
