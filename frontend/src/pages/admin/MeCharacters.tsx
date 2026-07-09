import { Alert, Center, Loader } from '@mantine/core'
import { Navigate } from 'react-router-dom'

import { useMeCharacterList } from '@/hooks/useCharacters'

const AdminMeCharacters = () => {
  const { data: characters, loading, error } = useMeCharacterList()

  if (loading) return <Center h="30vh"><Loader /></Center>
  if (error) return <Alert color="red">無法載入角色資料。</Alert>
  if (!characters || characters.length === 0) {
    return <Alert>
      你目前沒有連結任何角色，請聯繫管理員將角色指派給你的帳號。
    </Alert>
  }

  return <Navigate to={`/admin/me/characters/${characters[0].id}`} replace />
}

export default AdminMeCharacters
