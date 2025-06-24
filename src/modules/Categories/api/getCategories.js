import { apiRequest } from '../../../utils/api.js'

export const getCategories = async () => {
  const response = await apiRequest({
    url: '/api/categories',
    method: 'GET',
  })
  return response.data.categories
}

export const getReviews = async () => {
  const response = await apiRequest({
    url: '/api/categories',
    method: 'GET',
  })
  return response.data
}

export const getRoll = async () => {
  const response = await apiRequest({
    url: '/api/categories',
    method: 'GET',
  })
  return response.data
}

export const getExpertsByCategory = async ({ queryKey }) => {
  const [, category] = queryKey
  const response = await apiRequest({
    url: `/api/experts?category=${category}`,
    method: 'GET',
  })
  return response.data
}
