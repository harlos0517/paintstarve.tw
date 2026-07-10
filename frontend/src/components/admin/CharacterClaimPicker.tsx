import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Select,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useState } from 'react'

import { getErrorMessage } from '@/api/backendClient'
import { CharacterClaim, CharacterClaimStatus } from '@/api/characterClaims'
import { Character, CharacterRole } from '@/api/characters'
import {
  useCreateCharacterClaim,
  useDeleteCharacterClaim,
  useMeCharacterClaims,
} from '@/hooks/useCharacterClaims'
import { usePublicCharacterList } from '@/hooks/useCharacters'

const STATUS_LABEL: Record<CharacterClaimStatus, string> = {
  PENDING: '審核中', APPROVED: '已核准', REJECTED: '已拒絕',
}
const STATUS_COLOR: Record<CharacterClaimStatus, string> = {
  PENDING: 'yellow', APPROVED: 'green', REJECTED: 'red',
}

interface ClaimRowProps {
  claim: CharacterClaim
  onWithdraw: (claimId: string) => void
}

const ClaimRow = ({ claim, onWithdraw }: ClaimRowProps) => {
  const { role, year, class: className, unit, title } = claim.character
  const desc = role === 'STAFF' ? `${title} ${unit}` : `${year}年${className ?? ''}班`

  return <Card key={claim.id} withBorder padding="sm">
    <Group justify="space-between">
      <Text>
        {claim.character.name} ({desc})
      </Text>
      <Group gap="xs">
        <Badge color={STATUS_COLOR[claim.status]} variant="light">
          {STATUS_LABEL[claim.status]}
        </Badge>
        {claim.status === 'PENDING' && <Button
          size="xs" variant="subtle" color="red"
          onClick={() => onWithdraw(claim.id)}
        >
          撤回
        </Button>}
      </Group>
    </Group>
  </Card>
}

const CLAIM_BUTTON_LABEL: Record<CharacterClaimStatus, string> = {
  PENDING: '已申請', APPROVED: '已核准', REJECTED: '重新申請',
}

interface CharacterClaimItemProps {
  character: Character
  existingStatus: CharacterClaimStatus | undefined
  refetch: () => void
}

const CharacterClaimItemPicker = ({
  character,
  existingStatus,
  refetch,
}: CharacterClaimItemProps) => {
  const { role, year, class: className, unit, title } = character
  const desc = role === 'STAFF' ? `${title} ${unit}` : `${year}年${className ?? ''}班`

  const { mutate: createClaim, loading: creating } = useCreateCharacterClaim()

  const [submitError, setSubmitError] = useState<string>()

  // A rejected claim can be resubmitted; only PENDING/APPROVED block re-applying.
  const disabled = existingStatus === 'PENDING' || existingStatus === 'APPROVED'

  const handleClaim = async() => {
    setSubmitError(undefined)
    try {
      await createClaim(character.id)
      refetch()
    } catch(err) {
      setSubmitError(getErrorMessage(err))
    }
  }

  return <Card key={character.id} withBorder padding="sm">
    <Group>
      <Text>{character.name} ({desc})</Text>
      <Space flex={1} />
      {submitError && <Text size="xs" c="red">{submitError}</Text>}
      <Button
        size="xs"
        disabled={disabled}
        loading={creating}
        onClick={() => handleClaim()}
      >
        {existingStatus ? CLAIM_BUTTON_LABEL[existingStatus] : '這是我的角色'}
      </Button>
    </Group>
  </Card>
}

const CharacterClaimPicker = () => {
  const {
    data: claims, loading: claimsLoading, error: claimsError, refetch,
  } = useMeCharacterClaims()
  const { mutate: withdraw } = useDeleteCharacterClaim()

  const [name, setName] = useState('')
  const [role, setRole] = useState<CharacterRole | null>(null)

  const { data: searchResult, loading: searching } = usePublicCharacterList({
    name: name || undefined,
    role: role ?? undefined,
    per: 10,
  })

  const claimStatusByCharacterId = new Map(
    (claims ?? []).map(claim => [claim.character.id, claim.status]),
  )

  const handleWithdraw = async(claimId: string) => {
    await withdraw(claimId)
    refetch()
  }

  return <Stack maw="40rem" w="100%">
    <Title order={4}>你的角色認領申請</Title>
    {Boolean(claimsError) && <Alert color="red">無法載入認領紀錄。</Alert>}
    {claimsLoading
      ? <Loader size="sm" />
      : claims && claims.length > 0
        ? <Stack gap="xs">
          {claims.map(claim =>
            <ClaimRow key={claim.id} claim={claim} onWithdraw={handleWithdraw} />,
          )}
        </Stack>
        : <Text size="sm" c="dimmed">尚未提出任何角色認領申請。</Text>
    }

    <Title order={4} mt="md">尋找你的角色</Title>
    <Text size="sm" c="dimmed">
      找到屬於你的角色後送出認領申請，帳號審核通過後會自動連結到你的帳號。
    </Text>
    <Group>
      <TextInput
        flex={1} label="姓名" value={name}
        onChange={event => setName(event.currentTarget.value)}
      />
      <Select
        label="身份" clearable value={role}
        data={[{ value: 'STUDENT', label: '學生' }, { value: 'STAFF', label: '教職員' }]}
        onChange={value => setRole(value as CharacterRole | null)}
      />
    </Group>
    <Box mah="20rem" style={{ overflowY: 'auto' }}>
      {searching
        ? <Loader size="sm" />
        : <>
          {searchResult?.characters.length === 0 && (
            <Text size="sm" c="dimmed">找不到符合的角色。</Text>
          )}
          {searchResult?.characters.map(character => <Box key={character.id} mb="xs">
            <CharacterClaimItemPicker
              character={character}
              existingStatus={claimStatusByCharacterId.get(character.id)}
              refetch={refetch}
            />
          </Box>)}
        </>}
    </Box>
  </Stack>
}

export default CharacterClaimPicker
