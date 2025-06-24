import { apiRequest } from '../../../utils/api.js'

export const getExpertsSearchByCategory = async ({ queryKey }) => {
    const [_key, subtitle, search, filters] = queryKey

    const params = new URLSearchParams()

    if (search) params.append('search', search)
    if (subtitle) params.append('category', subtitle)
    if (filters?.rating) params.append('rating', filters.rating)
    if (filters?.isAFree) params.append('isAFree', filters.isAFree)

    const response = await apiRequest({
        url: `/api/experts?${params.toString()}`,
        method: 'GET',
    })

    return response.data
}

export const getExpertById = async (expertId) => {
    const response = await apiRequest({
        url: `/api/experts/${expertId}`,
        method: 'GET',
    })
    return response.data
}

export const getSlotsExpertById = async (expertId) => {
    const response = await apiRequest({
        url: `/api/bookings/available/${expertId}`,
        method: 'GET',
    })
    return response.data
}
