import React from 'react'

type OrderStatCardProps = {
  value: number | string
  label: string
  className?: string
}

const StatCard = ({ value, label, className }: OrderStatCardProps) => (
  <div
    className={`w-56 h-20 rounded-2xl shadow-md bg-secondary pl-4 pt-3
                dark:bg-secondary-dark shadow-secondary dark:shadow-secondary-dark
                ${className}`}
  >
    <p className="font-semibold">{value}</p>

    <p className="text-sm text-foreground-secondary dark:text-foreground-secondary-dark">
      {label}
    </p>
  </div>
)

export default StatCard
