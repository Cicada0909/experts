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
        baseURL:
            'https://4da1-2a03-32c0-5002-ba09-9573-6d88-96f2-9872.ngrok-free.app',
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
