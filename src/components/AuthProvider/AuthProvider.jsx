import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Loading from '../Loading/Loading'
import styles from './AuthProvider.module.css'

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

    // const initData = window?.Telegram?.WebApp?.initData
    const initData = ''

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
        return <div>Ошибка или невалидный токен, попробуйте позже.</div>
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
