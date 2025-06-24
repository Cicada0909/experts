import { apiRequest } from "../../../utils/api.js";

export const getUserById = async (userId) => {
  const response = await apiRequest({
    url: `/api/users/${userId}`,
    method: 'GET',
  })
  return response.data
}
