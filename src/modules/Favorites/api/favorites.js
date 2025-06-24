import { apiRequest } from '../../../utils/api'

export const getFavorites = async () => {
    const response = await apiRequest({
        url: '/api/favorites',
        method: 'GET',
    })
    return response.data
}

export const addFavorite = async (expertId) => {
    const response = await apiRequest({
        url: '/api/favorites',
        method: 'POST',
        data: {
            expert_id: expertId,
        },
    })
    return response.data
}

export const removeFavorite = async (expertId) => {
    const response = await apiRequest({
        url: '/api/favorites',
        method: 'DELETE',
        data: {
            expert_id: expertId,
        },
    })
    return response.data
}

removeFavorite
