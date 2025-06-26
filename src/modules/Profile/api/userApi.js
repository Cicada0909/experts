import { apiRequest } from '../../../utils/api'

export const getUserById = async (userId) => {
    const response = await apiRequest({
        url: `/api/users/${userId}`,
        method: 'GET',
    })
    return response.data
}
