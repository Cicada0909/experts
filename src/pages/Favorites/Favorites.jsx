import React, { useEffect, useRef } from 'react'
import styles from '../Favorites/Favorites.module.css'
import ExpertItem from '../../components/ExpertItem/ExpertItem'
import { useQuery } from '@tanstack/react-query'
import { getFavorites } from '../../modules/Favorites/api/favorites'
import ExpertsListSkeleton from '../../modules/Categories/components/ExpertsListSkeleton/ExpertsListSkeleton'
import NotFoundPage from '../../modules/Favorites/api/components/NotFoundPage.jsx'

const Favorites = () => {
    const wrapperRef = useRef(null)
    const { data, isLoading, isError } = useQuery({
        queryKey: ['favorites'],
        queryFn: getFavorites,
    })

    useEffect(() => {
        if (wrapperRef.current) {
            wrapperRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [])

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            {isLoading ? (
                <div className={styles.items}>
                    <ExpertsListSkeleton />
                </div>
            ) : isError ? (
                <p>Произошла ошибка при загрузке</p>
            ) : data?.length === 0 ? (
                <NotFoundPage />
            ) : (
                <div className={styles.items}>
                    {data.map((person) => (
                        <ExpertItem
                            key={person.id}
                            person={person}
                            className={styles.item}
                            isFavorites={true}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Favorites
