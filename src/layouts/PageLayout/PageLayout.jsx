import React, { useEffect, useRef, useState } from 'react'
import styles from './PageLayout.module.css'
import Menu from '../../components/Menu/Menu'
import { Outlet, useParams } from 'react-router-dom'

const PageLayout = () => {
    const [element, setElement] = useState(false)
    const wrapperRef = useRef(null)
    const { subtitle, id } = useParams()

    const handleClick = () => {
        const telegram = window.Telegram
        if (telegram?.WebApp?.HapticFeedback) {
            telegram.WebApp.HapticFeedback.impactOccurred('medium')
        }

        console.log(123)
        setElement(true)
    }

    useEffect(() => {
        wrapperRef.current?.scrollTo({ top: 0 })
    }, [subtitle, id])

    return (
        <div className={styles.wrapper}>
            <div className={styles.content} ref={wrapperRef}>
                <Outlet />
            </div>
            <Menu />
        </div>
    )
}

export default PageLayout
