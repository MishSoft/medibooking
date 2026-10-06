import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface DropDownProps {
  data: string[]
  className: string
}

const DropDown = ({ data, className }: DropDownProps) => {
  const [select, setSelect] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const current = select ?? data[0]
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [isOpen])


  return (
    <div ref={menuRef} className="max-w-100 relative">
      <div onClick={() => setIsOpen(prev => !prev)} className="capitalize cursor-pointer flex items-center justify-between  text-md px-2 text-[#BBCABF] bg-[#070F21] py-2 rounded-md font-semibold">
        {current}
        <ChevronDown className={`${isOpen ? "rotate-180" : "rotate-0"} duration-200 transition-all`} />
      </div>
      <div className={` ${isOpen ? "flex flex-col" : "hidden"} absolute w-full left-0 gap-y-1 bg-[#070F21] py-2 px-1 rounded-md`}>
        {data.map(city => {
          return (
            <button key={city} onClick={() => {
              setSelect(city)
              setIsOpen(false)
            }} className={`p-2 text-[#BBCABF] ${current === city ? "bg-[#f2f3f6]/5" : "hover:bg-[#f2f3f6]/5"} text-start cursor-pointer  capitalize text-md font-semibold rounded-md`}>
              {city}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default DropDown
