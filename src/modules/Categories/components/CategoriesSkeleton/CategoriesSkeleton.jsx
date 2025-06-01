import React from 'react'
import { Skeleton } from '@mui/material'
import styles from './CategoriesSkeleton.module.css'

const CategoriesSkeleton = () => {
    const data = Array.from({ length: 13 })
    return (
        <div className={styles.wrapper}>
            <div className={styles.items}>
                {data.map((_, index) => (
                    <Skeleton
                        key={index}
                        className={styles.item}
                        variant="caption"
                        sx={{ height: '4rem' }}
                    />
                ))}
            </div>
        </div>
    )
}

export default CategoriesSkeleton
