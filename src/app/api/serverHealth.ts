import api from '@/api'

const checkServerHealth = async () => {
  const { data: status } = await api.get('/ping')

  return status
}

export default checkServerHealth
