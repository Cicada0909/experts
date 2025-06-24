import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Loading from '../Loading/Loading'
import styles from './AuthProvider.module.css'
import NotFoundPage from '../../modules/Favorites/api/components/notFoundPage'

const fetchToken = async (initData) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/telegram`,
            { initData },
            { headers: { 'ngrok-skip-browser-warning': 'true' } }
        )
        return response.data
    } catch (err) {
        throw new Error('Ошибка запроса токена: ' + err.message)
    }
}

const validateToken = async (token) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/categories`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
            }
        )
        return response.status === 200
    } catch (err) {
        return false
    }
}

const useAuth = () => {
    const [logs, setLogs] = useState([])
    const [token, setToken] = useState(sessionStorage.getItem('token') || null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const log = (msg) => {
        console.log(msg)
        setLogs((prev) => [...prev, msg])
    }

    //'query_id=AAGCx6o1AgAAAILHqjUK9Jw1&user=%7B%22id%22%3A5195351938%2C%22first_name%22%3A%22%D0%90%D0%BB%D0%B8%D0%B1%D0%B5%D0%BA%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22cicada98%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FU8mJJotcmRJ5XYN_BmUdr3sbjmhznzvLYGEKOCtbIr-G1nhi08nLzyAweEQGDGVZ.svg%22%7D&auth_date=1746606487&signature=dIOkHPpKMsbzT-AbHLBlUSnvq3P-LD1mFxMq8yZ6j4kqbbG-WPYEGAsl7VTvIEPrHIdWqyN2YGVA-n6DGYLYCg&hash=997f2c49224ecffe45f4f679c2d887a355a96cf13aba439e03909f886aa8f723'

    // query_id=AAGvDltlAgAAAK8OW2Xbuwqq&user=%7B%22id%22%3A5995433647%2C%22first_name%22%3A%22Joel%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Joeljlk%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FqJevG-UuSJi_sJ8Ahc-qZBu9E3oykkI2tc29V_phwsu1FhDmn6wbcpQVF8rH4Sfp.svg%22%7D&auth_date=1749232212&signature=1u7zftxnRC3MW60EBx5OrTO_VdWTFbetIRK09h8UdGvIpm3LFKUbJtqgFXnBW9SVi2UPd5DcbZ7K8VBlzVpTBw&hash=e7ed4c19f13d6c4925281f260d7146739ec70561643812bd9c638ccd6fb11836

    // я AAGCx6o1AgAAAILHqjUK9Jw1&user=%7B%22id%22%3A5195351938%2C%22first_name%22%3A%22%D0%90%D0%BB%D0%B8%D0%B1%D0%B5%D0%BA%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22cicada98%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FU8mJJotcmRJ5XYN_BmUdr3sbjmhznzvLYGEKOCtbIr-G1nhi08nLzyAweEQGDGVZ.svg%22%7D&auth_date=1746606487&signature=dIOkHPpKMsbzT-AbHLBlUSnvq3P-LD1mFxMq8yZ6j4kqbbG-WPYEGAsl7VTvIEPrHIdWqyN2YGVA-n6DGYLYCg&hash=997f2c49224ecffe45f4f679c2d887a355a96cf13aba439e03909f886aa8f723

    // const initData = window?.Telegram?.WebApp?.initData
    const initData =
        'query_id=AAGCx6o1AgAAAILHqjUK9Jw1&user=%7B%22id%22%3A5195351938%2C%22first_name%22%3A%22%D0%90%D0%BB%D0%B8%D0%B1%D0%B5%D0%BA%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22cicada98%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FU8mJJotcmRJ5XYN_BmUdr3sbjmhznzvLYGEKOCtbIr-G1nhi08nLzyAweEQGDGVZ.svg%22%7D&auth_date=1746606487&signature=dIOkHPpKMsbzT-AbHLBlUSnvq3P-LD1mFxMq8yZ6j4kqbbG-WPYEGAsl7VTvIEPrHIdWqyN2YGVA-n6DGYLYCg&hash=997f2c49224ecffe45f4f679c2d887a355a96cf13aba439e03909f886aa8f723'

    useEffect(() => {
        const authorize = async () => {
            setLoading(true)
            setError(null)

            try {
                let currentToken = token

                if (!currentToken) {
                    const data = await fetchToken(initData)
                    if (data.access_token) {
                        currentToken = data.access_token
                        sessionStorage.setItem('token', currentToken)
                        setToken(currentToken)
                        log('Новый токен получен: ' + currentToken)
                    } else {
                        log('Ошибка получения токена: ' + JSON.stringify(data))
                        throw new Error('Токен отсутствует в ответе')
                    }
                }

                const isValid = await validateToken(currentToken)
                if (isValid) {
                    setIsAuthenticated(true)
                    log('Токен валиден')
                } else {
                    setToken(null)
                    sessionStorage.removeItem('token')
                    setIsAuthenticated(false)
                    log('Токен невалиден')
                }
            } catch (err) {
                setError(err)
                setIsAuthenticated(false)
                log('Ошибка авторизации: ' + err.message)
            } finally {
                setLoading(false)
            }
        }

        authorize()
    }, [token])

    return {
        tokenLoading: loading,
        tokenError: error,
        isAuthenticated,
        logs,
    }
}

const AuthProvider = ({ children }) => {
    const { tokenLoading, isAuthenticated, tokenError, logs } = useAuth()
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        if (!tokenLoading && isAuthenticated) {
            const timeout = setTimeout(() => {
                setShowContent(true)
            }, 300)
            return () => clearTimeout(timeout)
        }
    }, [tokenLoading, isAuthenticated])

    if (tokenLoading) {
        return (
            <div className={styles.loading__wrapper}>
                <Loading></Loading>
            </div>
        )
    }

    if (tokenError || !isAuthenticated) {
        return (
            <div className={styles.notFound}>
                <NotFoundPage
                    title="В доступе отказано"
                    text="Приложение доступно только через Telegram_bot"
                />
            </div>
        )
    }

    return (
        <>
            <div
                className={`${styles.loading__wrapper} ${
                    !tokenLoading ? styles['loading__wrapper--hidden'] : ''
                }`}
            >
                <Loading />
            </div>

            <div
                className={`${styles.content} ${
                    showContent ? styles['content--visible'] : ''
                }`}
            >
                {children}
            </div>
        </>
    )
}

export default AuthProvider
