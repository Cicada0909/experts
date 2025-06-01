import React from 'react'
import styles from './notFoundPage.module.css'
import imageNotFound from '../../../../assets/image/notFound.png'

const NotFoundPage = () => {
    return (
        <div className={styles.wrapper}>
            <img
                src={imageNotFound}
                alt="Не найдено"
                className={styles.image}
            />
            <div className={styles.text}>
                <h2 className={styles.title}>В избранном пока пусто</h2>
                <p>
                    Загляните в категории - возможно, там найдётся кто-то
                    особенный
                </p>
            </div>
        </div>
    )
}

export default NotFoundPage
