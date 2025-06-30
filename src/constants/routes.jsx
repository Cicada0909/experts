import { createHashRouter, redirect } from 'react-router-dom'
import { pageRoutes } from './pageRoutes'
import PageLayout from '../layouts/PageLayout/PageLayout'
import Search from '../pages/Search/Search'
import Categories from '../pages/Categories/Categories'
import Favorites from '../pages/Favorites/Favorites'
import Profile from '../pages/Profile/Profile'
import ExpertDetails from '../components/ExpertDetails/ExpertDetails'
import ExpertsList from '../modules/Categories/components/ExpertsList/ExpertsList'
import FormRegister from '../modules/Profile/FormRegister/FormRegister'
import Calendar from '../modules/Categories/components/Calendar/Calendar'
import Slots from '../modules/Profile/Slots/Slots'
import Services from '../modules/Profile/Services/Services'
import Applications from '../modules/Profile/Applications/Applications'

const router = createHashRouter([
    {
        path: '/',
        loader: () => redirect(pageRoutes.categoriesRoutes.categories),
    },
    {
        path: '/',
        element: <PageLayout />,
        children: [
            {
                path: pageRoutes.searchRoutes.search,
                element: <Search />,
            },
            {
                path: pageRoutes.categoriesRoutes.categories,
                element: <Categories />,
                children: [
                    {
                        path: pageRoutes.categoriesRoutes.category,
                        element: <ExpertsList />,
                    },
                    {
                        path: pageRoutes.categoriesRoutes.categoryExpert,
                        element: <ExpertDetails />,
                    },
                    {
                        path: pageRoutes.categoriesRoutes.categoriesExpert,
                        element: <ExpertDetails />,
                    },
                ],
            },
            {
                path: pageRoutes.favoritesRoutes.favorites,
                element: <Favorites />,
            },
            {
                path: pageRoutes.favoritesRoutes.favoritesExpert,
                element: <ExpertDetails />,
            },
            {
                path: pageRoutes.profileRoutes.profile,
                element: <Profile />,
            },
            {
                path: pageRoutes.profileRoutes.register,
                element: <FormRegister />,
            },
            {
                path: pageRoutes.profileRoutes.slots,
                element: <Slots />,
            },
            {
                path: pageRoutes.profileRoutes.services,
                element: <Services />,
            },
            {
                path: pageRoutes.profileRoutes.applications,
                element: <Applications />,
            },
            {
                path: pageRoutes.expertRoutes.expert,
                element: <ExpertDetails />,
            },
            {
                path: pageRoutes.expertDate,
                element: <Calendar />,
            },
            {
                path: '*',
                element: <Categories />,
            },
        ],
    },
])

export default router
