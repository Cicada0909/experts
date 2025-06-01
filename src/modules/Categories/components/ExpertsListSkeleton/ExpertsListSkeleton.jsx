import React from 'react'
import { Box, Skeleton } from '@mui/material'
import styles from './ExpertsListSkeleton.module.css'

const ExpertsListSkeleton = () => {
    const data = Array.from({ length: 7 })
    return (
        <div className={styles.wrapper}>
            <div className={styles.items}>
                {data.map((_, index) => (
                    <Skeleton
                        key={index}
                        className={styles.item}
                        variant="caption"
                        sx={{ height: '12.6vh' }}
                    />
                ))}
            </div>
        </div>
    )
}

export default ExpertsListSkeleton
