import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import router from './constants/routes'
import { useEffect } from 'react'
import AuthProvider from './components/AuthProvider/AuthProvider'

const queryClient = new QueryClient()

function App() {
    useEffect(() => {
        const tg = window.Telegram?.WebApp

        if (tg) {
            tg.expand()
            tg.disableVerticalSwipes()

            if (tg.version >= '7.7') {
            } else {
            }
        }
    }, [])

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App
