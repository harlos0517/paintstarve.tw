import { Alert, LoadingOverlay, Stack, Tabs } from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'

import CharacterEditor from '@/components/dashboard/CharacterEditor'
import { useMeCharacterList } from '@/hooks/useCharacters'

const DashboardMeCharacterEdit = () => {
  const navigate = useNavigate()

  const {
    data: charactersResult,
    loading,
    error,
  } = useMeCharacterList({ per: 8 })

  const { characterId } = useParams<{ characterId: string }>()

  if (!loading && (error || !characterId))
    return <Alert color="red">無法載入角色資料。</Alert>

  return <Stack pos="relative">
    <LoadingOverlay
      visible={loading}
      zIndex={1000}
      overlayProps={{ radius: 'sm', blur: 2, color: 'transparent' }}
    />
    {charactersResult && <Tabs
      value={characterId}
      onChange={value => navigate(`/dashboard/me/characters/${value}`)}
    >
      <Tabs.List>
        {charactersResult.characters.map(
          ch => <Tabs.Tab key={ch.id} value={ch.id}>{ch.name}</Tabs.Tab>,
        )}
      </Tabs.List>
    </Tabs>}
    {characterId && <CharacterEditor characterId={characterId} mode="me" />}
  </Stack>
}

export default DashboardMeCharacterEdit
