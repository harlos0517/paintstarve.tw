import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) throw new Error('VITE_API_URL missing.')

const backendClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// Unwrap express-zod-api's `{ status: 'success', data }` envelope so callers
// just get the payload back. Error responses are left untouched (still
// rejected as AxiosError) so getErrorMessage below can read them.
backendClient.interceptors.response.use(response => {
  response.data = response.data?.data
  return response
})

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error))
    return error.response?.data?.error?.message || error.message

  return error instanceof Error ? error.message : '發生未知錯誤'
}

export default backendClient
