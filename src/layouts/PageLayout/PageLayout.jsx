import React, { useState } from 'react'
import styles from './PageLayout.module.css'
import Menu from '../../components/Menu/Menu'
import { Outlet } from 'react-router-dom'

const PageLayout = () => {
    const [element, setElement] = useState(false)

    const handleClick = () => {
        const telegram = window.Telegram
        if (telegram?.WebApp?.HapticFeedback) {
            telegram.WebApp.HapticFeedback.impactOccurred('medium')
        }

        console.log(123)
        setElement(true)
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <Outlet />
            </div>
            <Menu />
        </div>
    )
}

export default PageLayout
