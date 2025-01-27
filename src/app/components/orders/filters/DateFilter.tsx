import { useTranslations } from 'next-intl'
import Image from 'next/image'

type DateFilterProps = {
  startDate?: string
  endDate?: string
  onStartDateChange: (startDate: string) => void
  onEndDateChange: (endDate: string) => void
  onReset: () => void
  isOpen: boolean
  onToggle: () => void
}

const DateFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
  isOpen,
  onToggle
}: DateFilterProps) => {
  const translations = useTranslations('OrdersFilter')

  return (
    <div className="flex items-center space-x-2">
      <button onClick={onToggle} className="flex items-center">
        <Image
          src="/icons/filter/calendar.svg"
          width={20}
          height={20}
          alt="Calendar"
          className="dark:invert mr-1.5"
        />

        {translations('orderByDate')}

        <Image
          src="/icons/arrows/arrow-expand.svg"
          width={10}
          height={10}
          alt="Arrow expand"
          className={`transition-transform duration-300 ease-out dark:invert ml-2`}
        />
      </button>

      {(startDate || endDate) && (
        <button
          onClick={onReset}
          className="ml-2 font-semibold text-[10px] text-red-500"
        >
          X
        </button>
      )}

      {isOpen && (
        <div className="absolute bg-secondary dark:bg-secondary-dark p-4 shadow-lg rounded-md z-10 w-64 mt-2 -left-2 top-full">
          <div className="flex flex-col mb-4">
            <label htmlFor="startDate" className="font-semibold mb-2">
              {translations('startDate')}
            </label>

            <input
              type="date"
              id="startDate"
              value={startDate || ''}
              onChange={e => onStartDateChange(e.target.value)}
              className="p-2 rounded-md w-full"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="endDate" className="font-semibold mb-2">
              {translations('endDate')}
            </label>

            <input
              type="date"
              id="endDate"
              value={endDate || ''}
              onChange={event => onEndDateChange(event.target.value)}
              className="p-2 rounded-md w-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DateFilter
