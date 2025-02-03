import { OrderStatusEnum } from '@/types/models/order'
import { useTranslations } from 'next-intl'

type TranslationFunction = ReturnType<typeof useTranslations<'OrderStatus'>>

export const getOrderStatusLabels = (translations: TranslationFunction) => ({
  [OrderStatusEnum.Pending]: translations('pending'),
  [OrderStatusEnum.Processing]: translations('processing'),
  [OrderStatusEnum.Shipping]: translations('shipping'),
  [OrderStatusEnum.Delivered]: translations('delivered')
})
