import React from 'react'
import Image from 'next/image'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (pageNumber: number) => void
}

const MAX_VISIBLE_PAGES = 5

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) => {
  const calculateVisiblePages = () => {
    const startPage = Math.max(
      Math.min(
        currentPage - Math.floor(MAX_VISIBLE_PAGES / 2),
        totalPages - MAX_VISIBLE_PAGES + 1
      ),
      1
    )
    const endPage = Math.min(startPage + MAX_VISIBLE_PAGES - 1, totalPages)

    const pages = []

    if (startPage > 1) pages.push({ key: '1', page: 1 })
    if (startPage > 2) pages.push({ key: 'start-ellipsis', page: '...' })

    for (let i = startPage; i <= endPage; i++)
      pages.push({ key: i.toString(), page: i })

    if (endPage < totalPages - 1)
      pages.push({ key: 'end-ellipsis', page: '...' })
    if (endPage < totalPages)
      pages.push({ key: totalPages.toString(), page: totalPages })

    return pages
  }

  const visiblePages = calculateVisiblePages()

  const ArrowButton = ({
    direction,
    onClick,
    disabled
  }: {
    direction: 'previous' | 'next'
    onClick: () => void
    disabled: boolean
  }) => (
    <button onClick={onClick} disabled={disabled} className="text-foreground">
      <Image
        src="/icons/arrows/arrow-back.svg"
        width={15}
        height={15}
        alt={direction === 'previous' ? 'Previous' : 'Next'}
        className={`dark:invert ${direction === 'next' ? 'rotate-180' : ''}`}
      />
    </button>
  )

  return (
    <div className="mt-4 flex space-x-4">
      <ArrowButton
        direction="previous"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      />

      {visiblePages.map(({ key, page }) => (
        <button
          key={key}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          className={`font-semibold text-sm px-3.5 py-2 rounded-full 
                        ${
                          page === currentPage
                            ? 'bg-foreground dark:bg-foreground-dark text-secondary dark:text-secondary-dark'
                            : 'bg-secondary dark:bg-secondary-dark text-foreground dark:text-foreground-dark hover:bg-gray-300 dark:hover:bg-gray-700'
                        }`}
          disabled={typeof page !== 'number'}
        >
          {page}
        </button>
      ))}

      <ArrowButton
        direction="next"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      />
    </div>
  )
}

export default Pagination
