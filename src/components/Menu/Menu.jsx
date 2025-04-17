import React, { useState } from 'react'
import styles from './Menu.module.css'
import { Link } from 'react-router-dom'
import { pageRoutes } from '../../constants/pageRoutes'
import profile from '../../assets/icons/profile.svg'
import files from '../../assets/icons/files.webp'

const Menu = () => {
    const [selected, setSelected] = useState('files')

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
                <Link
                    to={pageRoutes.filesRoutes.files}
                    className={styles.menu__btn}
                    onClick={() => {
                        hapticFeedback()
                        handleSelect('files')
                    }}
                >
                    {/* <img
                        src={files}
                        className={styles.iconFiles}
                        alt="files"
                    ></img>{' '} */}
                    <h4
                        className={`${styles.title} ${selected === 'files' ? styles.selected : ''}`}
                    >
                        Поиск
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
                    {/* <img
                        src={profile}
                        className={styles.iconProfile}
                        alt="profile"
                    ></img>{' '} */}
                    <h4
                        className={`${styles.title} ${selected === 'profile' ? styles.selected : ''}`}
                    >
                        Категории
                    </h4>
                </Link>
            </div>
        </div>
    )
}

export default Menu
