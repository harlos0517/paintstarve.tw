// src/api.ts
import axios from 'axios'

import { DataTypeMap, Sheet } from '@/api/types'

const API_URL = import.meta.env.VITE_API_URL
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID

if (!API_URL) throw new Error('VITE_API_URL missing.')
if (!SPREADSHEET_ID) throw new Error('VITE_SPREADSHEET_ID missing.')

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
})

export const getData = async<Name extends Sheet>(sheet: Name) => {
  const response = await api.get(`/data/${SPREADSHEET_ID}/${sheet}`)
  return response.data as DataTypeMap[Name][]
}
