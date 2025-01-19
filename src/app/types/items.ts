import Pagination from '@/types/pagination'

type Item = {
  id: number
  imageUrl: string
  nameKey: string
  descriptionKey: string
  price: number
}

type ItemsResponse = Pagination & {
  items: Item[]
}

export default ItemsResponse
