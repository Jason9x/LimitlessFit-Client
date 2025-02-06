import { useState, useEffect, RefObject } from 'react'

const useDropdownPosition = (
  triggerRef: RefObject<HTMLElement | null>,
  dropdownHeight: number = 144
): 'top' | 'bottom' => {
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>(
    'bottom'
  )

  useEffect(() => {
    if (!triggerRef.current) return

    const calculatePosition = () => {
      const triggerRect = triggerRef.current?.getBoundingClientRect()
      const spaceBelowWindow = window.innerHeight - (triggerRect?.bottom ?? 0)

      setDropdownPosition(spaceBelowWindow < dropdownHeight ? 'top' : 'bottom')
    }

    calculatePosition()

    window.addEventListener('resize', calculatePosition)

    return () => window.removeEventListener('resize', calculatePosition)
  }, [triggerRef, dropdownHeight])

  return dropdownPosition
}

export default useDropdownPosition
