import { PaginationParams } from './pagination'

export type UserSearchRequest = PaginationParams & {
  searchTerm?: string
}
