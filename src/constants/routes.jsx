import { createHashRouter, redirect } from 'react-router-dom'
import { pageRoutes } from './pageRoutes'
import PageLayout from '../layouts/PageLayout/PageLayout'
import CollectingFiles from '../pages/CollectingFiles/CollectingFiles'
import Profile from '../pages/Profile/Profile'

const router = createHashRouter([
    {
        path: '/',
        loader: () => redirect(pageRoutes.filesRoutes.files),
    },
    {
        path: '/',
        element: <PageLayout />,
        children: [
            {
                path: pageRoutes.filesRoutes.files,
                element: <CollectingFiles />,
            },
            {
                path: pageRoutes.profileRoutes.profile,
                element: <Profile />,
            },
        ],
    },
])

export default router
