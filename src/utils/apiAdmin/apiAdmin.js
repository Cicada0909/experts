import { apiRequest } from '../api'

export const deleteExpert = async (expertId) => {
    const response = await apiRequest({
        url: `/api/experts/${expertId}`,
        method: 'DELETE',
    })
    return response.data
}

export const downloadExpertsExcel = async () => {
    const response = await apiRequest({
        url: '/api/experts-to-excel',
        method: 'GET',
        responseType: 'blob',
    })

    const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result.split(',')[1]) // Remove data: prefix
        reader.readAsDataURL(response.data)
    })

    window.Telegram.WebApp.downloadFile({
        url: base64,
        name: 'experts.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    return response.data
}

export const downloadUsers = async () => {
    const response = await apiRequest({
        url: '/api/users-to-excel',
        method: 'GET',
        responseType: 'blob',
    })

    const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result.split(',')[1])
        reader.readAsDataURL(response.data)
    })

    window.Telegram.WebApp.downloadFile({
        url: base64,
        name: 'users.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    return response.data
}

export const downloadStatiscs = async () => {
    const response = await apiRequest({
        url: '/api/statistics',
        method: 'GET',
        responseType: 'blob',
    })

    const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result.split(',')[1])
        reader.readAsDataURL(response.data)
    })

    window.Telegram.WebApp.downloadFile({
        url: base64,
        name: 'statistics.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    return response.data
}

export const downloadApplications = async () => {
    const response = await apiRequest({
        url: '/api/rejected-bookings',
        method: 'GET',
        responseType: 'blob',
    })

    const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result.split(',')[1])
        reader.readAsDataURL(response.data)
    })

    window.Telegram.WebApp.downloadFile({
        url: base64,
        name: 'rejected-bookings.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    return response.data
}
