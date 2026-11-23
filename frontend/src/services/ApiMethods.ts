import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosChatInstance, AxiosInstance } from "."




interface ApiVariables {
    URL: string,
    payload?: unknown,
    params?: Record<string, unknown>
}

//Normal API Request
const apiRequest = async <T>(
    method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
    URL: string,
    payload?: unknown,
    params?: Record<string, unknown>
) => {
    const response = await AxiosInstance.request<T>({
        method,
        url: URL,
        data: payload,
        params
    })

    return response?.data
}


//API METHODS


//AI Chat Method
const apiAiRequest = async <T>(
    method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
    URL: string,
    payload?: unknown,
    params?: Record<string, unknown>
) => {
    const response = await AxiosChatInstance.request<T>({
        method,
        url: URL,
        data: payload,
        params
    })

    return response?.data
}

//POST Method
export const useApiAIPostrequest = <T,>() => {
    return useMutation<T, Error, ApiVariables>({
        mutationFn: ({ URL, payload }) => apiAiRequest<T>("POST", URL, payload)
    })
}

//POST Method
export const useApiPostrequest = <T,>() => {
    return useMutation<T, Error, ApiVariables>({
        mutationFn: ({ URL, payload }) => apiRequest<T>("POST", URL, payload)
    })
}

// GET REQUEST
export const useApiGetRequest = <T,>(
    URL: string,
    params?: Record<string, unknown>,
    enabled = true
) => {
    return useQuery<T, Error, any>({
        queryKey: [URL, params],
        queryFn: () => apiRequest('GET', URL, undefined, params),
        enabled,
        staleTime: Infinity
    })
}

//UPDATE REQUEST
export const useApiUpdateRequest = <T,>() => {
    return useMutation<T, Error, ApiVariables>({
        mutationFn: ({ URL, payload }) => apiRequest('PUT', URL, payload)
    })
}

//DELTE REQUEST
export const useApiDeleteRequest = <T,>() => {
    return useMutation<T, Error, ApiVariables>({
        mutationFn: ({ URL, params }) => apiRequest('DELETE', URL, undefined, params)
    })
}