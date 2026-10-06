import { Check } from 'lucide-react'

interface CheckBoxProps {
  checked: boolean
  ariaLabel?: string
  onCheck?: (checked: boolean) => void
}


export default function Checkbox({ checked, ariaLabel, onCheck }: CheckBoxProps) {

  return (
    <div className='flex items-center gap-x-3'>
      <label aria-label={ariaLabel} className={`w-4 h-4 flex items-center justify-center ${checked ? "bg-[#070F21] " : ""} transition-all duration-200 rounded-sm group ring group-focus-within:ring-[#BBCABF] cursor-pointer`}>
        {checked && <Check className='text-white' size={14} />}
        <input
          onChange={e => onCheck?.(e.target.checked)}
          checked={checked}
          type="checkbox"
          className="sr-only " />


      </label>
      <span className='capitalize font-semibold'>remember me</span>
    </div>
  )
}

