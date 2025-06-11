import { useQuery } from '@tanstack/react-query'
import {
    getExpertCompletedBookings,
    getExpertFutureBookings,
    getUserCompletedBookings,
    getUserFutureBookings,
} from '../../../../Profile/api/expertsApi'

export const useUserFutureBookings = () =>
    useQuery(['userFutureBookings'], getUserFutureBookings)

export const useUserCompletedBookings = () =>
    useQuery(['userCompletedBookings'], getUserCompletedBookings)

export const useExpertFutureBookings = () =>
    useQuery(['expertFutureBookings'], getExpertFutureBookings)

export const useExpertCompletedBookings = () =>
    useQuery(['expertCompletedBookings'], getExpertCompletedBookings)
