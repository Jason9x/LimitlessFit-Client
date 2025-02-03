import { PaginationType } from '@/types/pagination'

export type User = {
  id: number
  email?: string
  name?: string
  role?: string
}

export type UserResponse = PaginationType & {
  users: User[]
}
