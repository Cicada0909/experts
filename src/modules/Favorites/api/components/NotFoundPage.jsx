import React from 'react'
import styles from './notFoundPage.module.css'
import imageNotFound from '../../../../assets/image/notFound.png'

const NotFoundPage = ({
    title = 'В избранном пока пусто',
    text = 'Загляните в категории - возможно, там найдётся кто-то особенный',
}) => {
    return (
        <div className={styles.wrapper}>
            <img
                src={imageNotFound}
                alt="Не найдено"
                className={styles.image}
            />
            <div className={styles.text}>
                <h2 className={styles.title}>{title}</h2>
                <p>{text}</p>
            </div>
        </div>
    )
}

export default NotFoundPage
