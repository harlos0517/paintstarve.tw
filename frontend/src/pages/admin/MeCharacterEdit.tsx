import { ActionIcon, Alert, Center, Loader, Stack, Tabs, Title } from '@mantine/core'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getErrorMessage } from '@/api/backendClient'
import { Character, MeCharacterUpdateInput } from '@/api/characters'
import CharacterForm from '@/components/admin/CharacterForm'
import { useMeCharacter, useMeCharacterList, useUpdateMeCharacter } from '@/hooks/useCharacters'
import { CopyIcon } from '@phosphor-icons/react'

interface EditorProps {
  character: Character
  onRefetch: () => void
}

// Keyed by characterId from the parent, so switching characters remounts
// this component and its local saved/error state resets naturally.
const Editor = ({ character, onRefetch }: EditorProps) => {

  const { mutate: updateCharacter, loading: saving } = useUpdateMeCharacter()
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string>()

  const handleSubmit = async(input: MeCharacterUpdateInput) => {
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

  const [showCopiedAlert, setShowCopiedAlert] = useState(false)
  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(character.id)
      .then(() => {
        setShowCopiedAlert(true)
        setTimeout(() => setShowCopiedAlert(false), 2000)
      })
  }

  return <Stack>
    <Title order={2}>
      {character.name}
      <ActionIcon variant="transparent" onClick={copyIdToClipboard}><CopyIcon /></ActionIcon>
    </Title>
    {showCopiedAlert && <Alert color="green">已複製 ID</Alert>}
    {saveError && <Alert color="red">{saveError}</Alert>}
    {saved && <Alert color="green">已儲存</Alert>}
    <CharacterForm
      key={character.id}
      character={character}
      mode="me"
      saving={saving}
      onSubmit={handleSubmit}
    />
  </Stack>
}

const AdminMeCharacterEdit = () => {
  const navigate = useNavigate()

  const {
    data: characters,
    loading: loadingCharacters,
    error: charactersError,
  } = useMeCharacterList({ per: 8 })

  const { characterId } = useParams<{ characterId: string }>()

  const {
    data: character,
    loading: loadingCharacter,
    error: characterError,
    refetch,
  } = useMeCharacter(characterId)

  if (loadingCharacters) return <Center h="30vh"><Loader /></Center>
  if (charactersError || characterError) return <Alert color="red">無法載入角色資料。</Alert>
  if (!characters || !character) return <Alert color="red">找不到此角色。</Alert>

  return <Stack>
    <Tabs
      value={characterId}
      onChange={value => {
        navigate(`/admin/me/characters/${value}`)
        refetch()
      }}
    >
      <Tabs.List>
        {characters.map(ch => <Tabs.Tab key={ch.id} value={ch.id}>{ch.name}</Tabs.Tab>)}
      </Tabs.List>
    </Tabs>
    {loadingCharacter
      ? <Center h="30vh"><Loader /></Center>
      : <Editor character={character} onRefetch={refetch} />
    }
  </Stack>
}

export default AdminMeCharacterEdit
