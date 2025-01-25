import { PaginationType } from '@/types/pagination'

export type Item = {
  id: number
  imageUrl: string
  nameKey: string
  descriptionKey: string
  price: number
}

export type ItemsResponse = PaginationType & {
  items: {
    $values: Item[]
  }
}
