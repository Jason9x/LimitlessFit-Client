import { PaginationType } from '@/types/pagination'

export enum Role {
  Admin = 'admin',
  User = 'user'
}

export type User = {
  id?: number
  email?: string
  name?: string
  role?: Role
}

export type UserResponse = PaginationType & {
  users: User[]
}
