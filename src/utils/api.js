import axios from 'axios'

export const apiRequest = async (props) => {
    const token = sessionStorage.getItem('token')

    const headers = {
        ...(props.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'ngrok-skip-browser-warning': 'true',
    }

    return axios.request({
        ...props,
        baseURL: import.meta.env.VITE_API_URL,
        headers,
    })
}

export const apiRequestWithBlob = async (props) => {
    const token = sessionStorage.getItem('token')

    const headers = {
        ...(props.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'ngrok-skip-browser-warning': 'true',
    }

    return axios.request({
        ...props,
        baseURL: import.meta.env.VITE_API_URL,
        headers,
        responseType: 'blob', // обязательно для blob
    })
}
