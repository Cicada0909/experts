import React, { useState } from 'react'
import styles from '../Favorites/Favorites.module.css'
import { Link } from 'react-router-dom'
import ExpertItem from '../../components/ExpertItem/ExpertItem'
import { useQuery } from '@tanstack/react-query'
import { getFavorites } from '../../modules/Favorites/api/favorites'
import ExpertsListSkeleton from '../../modules/Categories/components/ExpertsListSkeleton/ExpertsListSkeleton'
import NotFoundPage from '../../modules/Favorites/api/components/notFoundPage'

const Favorites = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['favorites'],
        queryFn: getFavorites,
    })

    return (
        <div className={styles.wrapper}>
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
