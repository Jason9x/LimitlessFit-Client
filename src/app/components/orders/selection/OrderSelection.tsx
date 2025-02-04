import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

import { fetchItems } from '@/api/services/items'

import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Snackbar from '@/components/ui/Snackbar'
import Pagination from '@/components/ui/Pagination'

import OrderSelectionItem from './OrderSelectionItem'

const PAGE_SIZE = 9

const OrderSelection = () => {
  const translations = useTranslations('OrderSelection')

  const [currentPage, setCurrentPage] = useState(1)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const {
    data: paginatedItems,
    isLoading,
    error
  } = useQuery({
    queryKey: ['items', currentPage, PAGE_SIZE],
    queryFn: () => fetchItems({ pageNumber: currentPage, pageSize: PAGE_SIZE })
  })

  useEffect(() => {
    if (error) setSnackbarOpen(true)
  }, [error])

  if (isLoading) return <LoadingSpinner />

  if (error)
    return (
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={error.message}
      />
    )

  return (
    <div className="p-10">
      <h2 className="text-xl font-semibold">{translations('selectItem')}</h2>

      <ul className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
        {paginatedItems?.items.map(item => (
          <OrderSelectionItem key={item.id} item={item} />
        ))}
      </ul>

      <Pagination
        currentPage={currentPage}
        totalPages={paginatedItems?.totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default OrderSelection
