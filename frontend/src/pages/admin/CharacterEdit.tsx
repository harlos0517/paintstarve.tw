import { useParams } from 'react-router-dom'

import AdminOnly from '@/components/admin/AdminOnly'
import CharacterEditor from '@/components/admin/CharacterEditor'

const AdminCharacterEditContent = () => {
  const { characterId } = useParams<{ characterId: string }>()

  return characterId && <CharacterEditor characterId={characterId} mode="admin" />
}

const AdminCharacterEdit = () => <AdminOnly><AdminCharacterEditContent /></AdminOnly>

export default AdminCharacterEdit
