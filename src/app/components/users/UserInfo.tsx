'use client'

import { User } from '@/types/models/user'

interface UserInfoProps {
  user: User
}

export const UserInfo = ({ user }: UserInfoProps) => (
  <div className="flex items-center mb-3 sm:mb-0">
    <div
      className="flex items-center justify-center w-8 h-8 mr-3 rounded-full
                    bg-primary dark:bg-primary-dark text-white"
    >
      {user.name?.[0]?.toUpperCase()}
    </div>

    <div>
      <p>{user.name}</p>

      <p className="text-sm text-foreground-secondary dark:text-foreground-secondary-dark">
        {user.email}
      </p>
    </div>
  </div>
)
