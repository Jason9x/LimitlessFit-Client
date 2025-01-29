import api from '@/api/api'

const checkServerHealth = async () => {
  try {
    const { data } = await api.get('/ping')

    return data
  } catch (error) {
    throw error
  }
}

export default checkServerHealth
