import axios from 'axios'

export const AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
})

export const AxiosChatInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
    },
})

AxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('sessionId')
    if (token) config.headers.Authorization = `Bearer ${token}`

    return config
})

//chat get header 
AxiosChatInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('sessionId')
    if (token) config.headers.Authorization = `Bearer ${token}`

    return config
})