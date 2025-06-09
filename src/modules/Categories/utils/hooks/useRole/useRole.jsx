import { useQuery } from '@tanstack/react-query'
import { getRoll } from '../../../api/getCategories'

export const useRole = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['roll'],
        queryFn: getRoll,
        select: (data) => data.user_role,
    })

    return {
        role: data,
        isLoading,
        isError,
    }
}
