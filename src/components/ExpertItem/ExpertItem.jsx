import { Link } from 'react-router-dom'
import styles from './ExpertItem.module.css'
import { Close } from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeFavorite } from '../../modules/Favorites/api/favorites'
import { Rating } from '@mui/material'

const ExpertItem = ({ person, isFavorites = false }) => {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: removeFavorite,
        onMutate: async (id) => {
            await queryClient.cancelQueries(['favorites'])

            const previousFavorites = queryClient.getQueryData(['favorites'])

            queryClient.setQueryData(['favorites'], (old) =>
                old?.filter((person) => person.id !== id)
            )

            return { previousFavorites }
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['favorites'], context.previousFavorites)
            console.error('Error deleting favorites', err)
        },
        onSettled: () => {
            queryClient.invalidateQueries(['favorites'])
        },
    })

    console.log(person)

    const handleRemove = (id) => {
        mutation.mutate(id)
    }

    return (
        <Link
            to={`/expert/${person.id}`}
            key={person.id}
            className={`${styles.item} clickable`}
        >
            {isFavorites && (
                <Close
                    className={styles.closeButton}
                    sx={{
                        position: 'absolute',
                        top: '7%',
                        right: '2.6%',
                        fontSize: '2rem',
                    }}
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleRemove(person.id)
                    }}
                />
            )}
            <img
                src={person.photo}
                alt={person.name}
                className={styles.avatar}
            />
            <div className={styles.info}>
                <h3 className={styles.name}>
                    {person.first_name} {person.last_name}
                </h3>
                <p className={styles.role}>{person.profession}</p>
            </div>
            <Rating
                value={person.rating}
                readOnly
                sx={{ mb: 1 }}
                className={styles.rating}
            />
        </Link>
    )
}

export default ExpertItem
