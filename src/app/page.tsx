'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { fetchItems } from '@/services/api/items'

import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Snackbar from '@/components/ui/Snackbar'

import Pagination from '@/components/Pagination'
import { useTranslations } from 'next-intl'

const PAGE_SIZE = 1

const OrderSelection = () => {
  const translations = useTranslations('OrderSelection')

  const [currentPage, setCurrentPage] = useState(1)
  const [errorMessage, setErrorMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['items', currentPage, PAGE_SIZE],
    queryFn: () => fetchItems(currentPage, PAGE_SIZE)
  })

  const handleError = useCallback(() => {
    if (!error) return

    setErrorMessage(error.message)
    setSnackbarOpen(true)
  }, [error])

  useEffect(() => handleError(), [error, handleError])

  if (isLoading) return <LoadingSpinner />

  if (error)
    return (
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={errorMessage}
      />
    )

  const totalPages = data?.totalPages || 1

  return (
    <div className="py-10 px-20">
      <h2 className="text-xl font-semibold">{translations('selectItem')}</h2>
      <ul>{data?.items.map(item => <p key={item.id}>{item.nameKey}</p>)}</ul>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default OrderSelection
