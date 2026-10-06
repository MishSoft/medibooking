import type { ComponentProps } from "react"

type InputProps = ComponentProps<"input">

const Input = ({ className = "", ...props }: InputProps) => {
  return (
    <input
      className={`w-full max-w-100 rounded-md bg-[#070F21] p-2 text-[#BBCABF] placeholder:text-[#BBCABF]/50 outline-none focus-visible:ring-2 focus-visible:ring-[#BBCABF] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

export default Input
