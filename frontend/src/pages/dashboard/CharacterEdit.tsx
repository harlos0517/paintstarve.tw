import { useParams } from 'react-router-dom'

import AdminOnly from '@/components/dashboard/AdminOnly'
import CharacterEditor from '@/components/dashboard/CharacterEditor'

const DashboardCharacterEditContent = () => {
  const { characterId } = useParams<{ characterId: string }>()

  return characterId && <CharacterEditor characterId={characterId} mode="admin" />
}

const DashboardCharacterEdit = () => <AdminOnly><DashboardCharacterEditContent /></AdminOnly>

export default DashboardCharacterEdit
