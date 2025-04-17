import { RouterProvider } from 'react-router-dom'
import router from './constants/routes'
import { useEffect } from 'react'

function App() {
    useEffect(() => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.disableVerticalSwipes()

            if (window.Telegram.WebApp.version >= '7.7') {
            } else {
            }
        }
    }, [])
    return <RouterProvider router={router} />
}

export default App
