import { Alert, Center, Loader, Stack, Title } from '@mantine/core'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { getErrorMessage } from '@/api/backendClient'
import { AdminCharacterUpdateInput, Character } from '@/api/characters'
import AdminOnly from '@/components/admin/AdminOnly'
import CharacterForm from '@/components/admin/CharacterForm'
import { useAdminCharacter, useUpdateAdminCharacter } from '@/hooks/useCharacters'

interface EditorProps {
  character: Character
  onRefetch: () => void
}

// Keyed by characterId from the parent, so navigating to a different
// character remounts this component and its local saved/error state resets.
const Editor = ({ character, onRefetch }: EditorProps) => {
  const { mutate: updateCharacter, loading: saving } = useUpdateAdminCharacter()
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string>()

  const handleSubmit = async(input: AdminCharacterUpdateInput) => {
    setSaveError(undefined)
    setSaved(false)
    try {
      await updateCharacter(character.id, input)
      setSaved(true)
      onRefetch()
    } catch(err) {
      setSaveError(getErrorMessage(err))
    }
  }

  return <Stack maw="50rem">
    <Title order={2}>{character.name}</Title>
    {saveError && <Alert color="red">{saveError}</Alert>}
    {saved && <Alert color="green">已儲存</Alert>}
    <CharacterForm character={character} mode="admin" saving={saving} onSubmit={handleSubmit} />
  </Stack>
}

const AdminCharacterEditContent = () => {
  const { characterId } = useParams<{ characterId: string }>()
  const { data: character, loading, error, refetch } = useAdminCharacter(characterId)

  if (loading) return <Center h="30vh"><Loader /></Center>
  if (error) return <Alert color="red">無法載入角色資料。</Alert>
  if (!character) return <Alert color="red">找不到此角色。</Alert>

  return <Editor key={characterId} character={character} onRefetch={refetch} />
}

const AdminCharacterEdit = () => <AdminOnly><AdminCharacterEditContent /></AdminOnly>

export default AdminCharacterEdit
