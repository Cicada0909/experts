import React from 'react'
import logo from '../../assets/image/logo.png'
import styles from './loading.module.css'

const Loading = () => {
    return (
        <div className={styles.wrapper}>
            <img className={styles.logo} src={logo} alt="logo" />
        </div>
    )
}

export default Loading
