import { PaginationType } from '@/types/pagination'

export enum Role {
  Admin = 1,
  User
}

export type User = {
  id?: number
  email?: string
  name?: string
  roleId: Role
}

export type UsersResponse = PaginationType & {
  users: User[]
}
