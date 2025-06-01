import React, { useState, useEffect } from 'react'
import styles from './Profile.module.css'
import { Button } from '@mui/material'

const Profile = () => {
    const [user, setUser] = useState(null)
    const [isImageLoaded, setIsImageLoaded] = useState(false)

    useEffect(() => {
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
        if (tgUser) {
            setUser(tgUser)
        }
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                {user?.photo_url ? (
                    <>
                        {!isImageLoaded && (
                            <div
                                className={`${styles.avatarSkeleton} ${styles.pulse}`}
                            ></div>
                        )}
                        <img
                            className={styles.avatar}
                            src={user.photo_url}
                            alt="User Avatar"
                            onLoad={() => setIsImageLoaded(true)}
                            style={{
                                display: isImageLoaded ? 'block' : 'none',
                            }}
                        />
                    </>
                ) : (
                    <div className={styles.avatarSkeleton}></div>
                )}
                <h4 className={styles.name}>
                    {user?.first_name && user?.last_name
                        ? `${user?.first_name} ${user?.last_name}`
                        : user?.first_name || user?.username || 'Гость'}
                </h4>
            </div>

            <Button
                variant="contained"
                size="large"
                className={styles.button}
                sx={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '1.4rem',
                    backgroundColor: 'var(--colors__green)',
                }}
            >
                Стать экспертом
            </Button>
        </div>
    )
}

export default Profile
