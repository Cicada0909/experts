import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addFavorite } from '../../modules/Favorites/api/favorites'
import { useParams } from 'react-router-dom'

export const useAddFavoriteMutation = () => {
    const queryClient = useQueryClient()
    const { id } = useParams()

    return useMutation({
        mutationFn: addFavorite,
        onMutate: async (expertId) => {
            await queryClient.cancelQueries(['favorites'])

            const previousFavorites = queryClient.getQueryData(['favorites'])

            queryClient.setQueryData(['favorites'], (old) => {
                const newFavorite = { id: expertId, expert_id: expertId } // Adjust structure based on your API response
                return old ? [...old, newFavorite] : [newFavorite]
            })

            return { previousFavorites }
        },
        onError: (err, expertId, context) => {
            queryClient.setQueryData(['favorites'], context.previousFavorites)
            console.error('Error adding favorite', err)
        },
        onSettled: () => {
            queryClient.invalidateQueries(['favorites'])
        },
    })
}
