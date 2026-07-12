import { useParams } from 'react-router-dom'

import AdminOnly from '@/components/dashboard/AdminOnly'
import CharacterEditor from '@/components/dashboard/CharacterEditor'

const DashboardCharacterEdit = () => {
  const { characterId } = useParams<{ characterId: string }>()

  return <AdminOnly>
    {characterId && <CharacterEditor characterId={characterId} mode="admin" />}
  </AdminOnly>
}

export default DashboardCharacterEdit
