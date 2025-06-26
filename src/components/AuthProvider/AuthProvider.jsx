import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Loading from '../Loading/Loading'
import styles from './AuthProvider.module.css'
import NotFoundPage from '../../modules/Favorites/api/components/NotFoundPage.jsx'

const fetchToken = async (initData) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/telegram`,
            { initData },
            { headers: { 'ngrok-skip-browser-warning': 'true' } }
        )
        console.log('fetchToken response:', response.data)
        return response.data
    } catch (err) {
        console.error('fetchToken error:', err.message)
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
        console.log('validateToken status:', response.status)
        return response.status === 200
    } catch (err) {
        console.error('validateToken error:', err.message)
        return false
    }
}

const useAuth = () => {
    const [logs, setLogs] = useState([])
    const [token, setToken] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const log = (msg) => {
        console.log(msg)
        setLogs((prev) => [...prev, msg])
    }

    const initData = window?.Telegram?.WebApp?.initData

    useEffect(() => {
        const authorize = async () => {
            setLoading(true)
            setError(null)

            if (!initData) {
                log(
                    'initData отсутствует. Запустите приложение через Telegram.'
                )
                setError(new Error('initData отсутствует'))
                setLoading(false)
                return
            }

            try {
                log('Запрашиваем токен с initData: ' + initData)
                const data = await fetchToken(initData)
                if (!data.access_token) {
                    log('Ошибка получения токена: ' + JSON.stringify(data))
                    throw new Error('Токен отсутствует в ответе')
                }

                const currentToken = data.access_token
                setToken(currentToken)
                log('Токен получен: ' + currentToken)

                log('Валидация токена')
                const isValid = await validateToken(currentToken)
                if (isValid) {
                    setIsAuthenticated(true)
                    log('Токен валиден')
                } else {
                    setToken(null)
                    setIsAuthenticated(false)
                    log('Токен невалиден')
                    throw new Error('Токен не прошел валидацию')
                }
            } catch (err) {
                log('Ошибка авторизации: ' + err.message)
                setError(err)
                setIsAuthenticated(false)
            } finally {
                setLoading(false)
            }
        }

        authorize()
    }, [])

    return {
        tokenLoading: loading,
        tokenError: error,
        isAuthenticated,
        logs,
        token,
    }
}

const AuthProvider = ({ children }) => {
    const { tokenLoading, isAuthenticated, tokenError, logs } = useAuth()

    // Логи для отладки
    console.log('AuthProvider state:', {
        tokenLoading,
        isAuthenticated,
        tokenError,
    })

    if (tokenLoading) {
        return (
            <div className={styles.loading__wrapper}>
                <Loading />
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

    return <div className={styles.content}>{children}</div>
}

export default AuthProvider
