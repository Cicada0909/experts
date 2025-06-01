import React, { useState } from 'react'
import styles from './Menu.module.css'
import { Link } from 'react-router-dom'
import { pageRoutes } from '../../constants/pageRoutes'
import {
    Abc,
    AccountCircle,
    MenuBook,
    Search,
    StarBorder,
    ViewHeadline,
} from '@mui/icons-material'

const Menu = () => {
    const [selected, setSelected] = useState('category')

    const hapticFeedback = () => {
        if (window.Telegram?.WebApp?.HapticFeedback?.impactOccurred) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy')
        }
    }

    const handleSelect = (item) => {
        setSelected(item)
    }

    return (
        <div className={styles.menu}>
            <div className={styles.wrapper}>
                {/* <Link
                    to={pageRoutes.searchRoutes.files}
                    className={styles.menu__btn}
                    onClick={() => {
                        hapticFeedback()
                        handleSelect('search')
                    }}
                >
                    <Search
                        className={`${styles.icon} ${selected === 'search' ? styles.selected : ''}`}
                        sx={{ fontSize: '3rem' }}
                    ></Search>
                    <h4
                        className={`${styles.title} ${selected === 'search' ? styles.selected : ''}`}
                    >
                        Поиск
                    </h4>
                </Link> */}
                <Link
                    to={pageRoutes.categoriesRoutes.categories}
                    className={styles.menu__btn}
                    onClick={() => {
                        hapticFeedback()
                        handleSelect('category')
                    }}
                >
                    <ViewHeadline
                        sx={{ fontSize: '3rem' }}
                        className={`${styles.icon} ${selected === 'category' ? styles.selected : ''}`}
                    ></ViewHeadline>

                    <h4
                        className={`${styles.title} ${selected === 'category' ? styles.selected : ''}`}
                    >
                        Категории
                    </h4>
                </Link>
                <Link
                    to={pageRoutes.favoritesRoutes.favorites}
                    className={styles.menu__btn}
                    onClick={() => {
                        hapticFeedback()
                        handleSelect('favorite')
                    }}
                >
                    <StarBorder
                        className={`${styles.icon} ${selected === 'favorite' ? styles.selected : ''}`}
                        sx={{ fontSize: '3rem' }}
                    ></StarBorder>
                    <h4
                        className={`${styles.title} ${selected === 'favorite' ? styles.selected : ''}`}
                    >
                        Избранное
                    </h4>
                </Link>
                <Link
                    to={pageRoutes.profileRoutes.profile}
                    className={styles.menu__btn}
                    onClick={() => {
                        hapticFeedback()
                        handleSelect('profile')
                    }}
                >
                    <AccountCircle
                        className={`${styles.icon} ${selected === 'profile' ? styles.selected : ''}`}
                        sx={{ fontSize: '3rem' }}
                    ></AccountCircle>
                    <h4
                        className={`${styles.title} ${selected === 'profile' ? styles.selected : ''}`}
                    >
                        Профиль
                    </h4>
                </Link>
            </div>
        </div>
    )
}

export default Menu
