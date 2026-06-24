import { createContext } from 'react'

import { Student } from '@/api/types'

interface GlobalContextProps {
  students: Student[]
}

const GlobalContext = createContext<GlobalContextProps>({
  students: [],
})

export default GlobalContext
