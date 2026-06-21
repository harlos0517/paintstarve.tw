import { useEffect, useState } from 'react'

import { getData } from '@/api'
import { DataTypeMap, Sheet } from '@/api/types'

const useData = <Name extends Sheet>(table: Name) => {
  const [data, setData] = useState<DataTypeMap[Name][]>([])

  useEffect(() => {
    getData(table).then(responseData => {
      if (!responseData) console.error(`No data found for table: ${table}`)
      if (!Array.isArray(responseData)) console.error(`Data for table ${table} is not an array`)
      setData(responseData)
    })
  }, [table])

  return data
}

export default useData
