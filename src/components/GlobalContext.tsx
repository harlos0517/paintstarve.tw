import { createContext } from 'react'

import { Participant } from '@/api/types'

interface GlobalContextProps {
  students: Participant[]
}

const GlobalContext = createContext<GlobalContextProps>({
  students: [],
})

export default GlobalContext
