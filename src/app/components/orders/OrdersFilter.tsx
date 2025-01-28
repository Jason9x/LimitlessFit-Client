import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

import useClickOutside from '@/hooks/useClickOutside'

import DateFilter from './filters/DateFilter'
import StatusFilter from './filters/StatusFilter'

import { OrderFilterType, OrderStatusEnum } from '@/types/order'

type OrderFilterProps = {
  onFilterChange: (filter: OrderFilterType) => void
}

const OrdersFilter = ({ onFilterChange }: OrderFilterProps) => {
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()
  const [status, setStatus] = useState<OrderStatusEnum>()
  const [activeFilter, setActiveFilter] = useState<'date' | 'status' | null>(
    null
  )

  const searchParams = useSearchParams()

  const filterRef = useRef<HTMLDivElement>(null)

  useClickOutside([filterRef], () => setActiveFilter(null))

  useEffect(() => {
    const filterParam = searchParams.get('filter')

    if (!filterParam) return

    try {
      const { startDate, endDate, status }: OrderFilterType =
        JSON.parse(filterParam)

      setStartDate(startDate)
      setEndDate(endDate)
      setStatus(status)
    } catch (error) {
      console.error('Failed to parse filters:', error)
    }
  }, [searchParams])

  const handleStartDateChange = (startDate: string) => {
    setStartDate(startDate)

    onFilterChange({ startDate, endDate, status })
  }

  const handleEndDateChange = (endDate: string) => {
    setEndDate(endDate)

    onFilterChange({ startDate, endDate, status })
  }

  const handleStatusChange = (status: OrderStatusEnum | undefined) => {
    setStatus(status)

    onFilterChange({ startDate, endDate, status })
  }

  const resetFilters = (filterType: 'date' | 'status') => {
    const resetState: Partial<OrderFilterType> = {
      startDate: filterType === 'date' ? undefined : startDate,
      endDate: filterType === 'date' ? undefined : endDate,
      status: filterType === 'status' ? undefined : status
    }

    const resetActions: Record<'date' | 'status', () => void> = {
      date: () => {
        setStartDate(undefined)
        setEndDate(undefined)
      },
      status: () => {
        setStatus(undefined)
      }
    }

    resetActions[filterType]()
    onFilterChange(resetState)
  }

  const toggleFilter = (filter: 'date' | 'status') =>
    setActiveFilter(previousState => (previousState === filter ? null : filter))

  return (
    <div
      ref={filterRef}
      className="flex items-center px-4 py-1.5 space-x-4 bg-secondary dark:bg-secondary-dark rounded-md
                 text-sm shadow-md shadow-secondary dark:shadow-secondary-dark relative"
    >
      <DateFilter
        isOpen={activeFilter === 'date'}
        onToggle={() => toggleFilter('date')}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onReset={() => resetFilters('date')}
      />

      <StatusFilter
        isOpen={activeFilter === 'status'}
        onToggle={() => toggleFilter('status')}
        status={status}
        onStatusChange={handleStatusChange}
        onReset={() => resetFilters('status')}
      />
    </div>
  )
}

export default OrdersFilter
