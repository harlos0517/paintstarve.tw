import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Group,
  Image,
  LoadingOverlay,
  MultiSelect,
  Space,
  Stack,
  Switch,
  TagsInput,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getErrorMessage } from '@/api/backendClient'
import { listPublicCharacters } from '@/api/characters'
import { MeWorkUpdateInput, WorkDetail } from '@/api/works'
import ImageSelectorModal, { ImageSelectorImage } from '@/components/dashboard/ImageSelectorModal'
import WorkVerifyStatusBadge from '@/components/dashboard/WorkVerifyStatusBadge'
import ImagePreview from '@/components/ImagePreview'
import { useDualModeMutation, useDualModeQuery } from '@/hooks/useDualMode'
import {
  useAdminWork,
  useCreateMeWork,
  useMeWork,
  useResolveWorkApproval,
  useUpdateAdminWork,
  useUpdateMeWork,
} from '@/hooks/useWorks'
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, TrashIcon } from '@phosphor-icons/react'

const MAX_IMAGES_PER_WORK = 10
const MAX_CHARACTERS_PER_WORK = 50

interface CharacterOption {
  value: string
  label: string
}

interface WorkFormProps {
  work?: WorkDetail
  mode: 'me' | 'admin'
  refetch?: () => void
}

const WorkForm = ({ work, mode, refetch }: WorkFormProps) => {
  const navigate = useNavigate()

  const [title, setTitle] = useState(work?.title ?? '')
  const [description, setDescription] = useState(work?.description ?? '')
  const [link, setLink] = useState(work?.link ?? '')
  const [tagNames, setTagNames] = useState<string[]>(work?.tags ?? [])
  const [show, setShow] = useState(work?.show ?? true)
  const [images, setImages] = useState<ImageSelectorImage[]>(work?.images ?? [])

  // Mantine's MultiSelect only renders a Pill for values present in `data`.
  // Keep a local option map seeded from the loaded work, merged with live
  // search results, so previously-picked characters don't lose their Pill
  // when the search text changes.
  const [characterOptions, setCharacterOptions] = useState<CharacterOption[]>(
    work?.characters.map(character => ({ value: character.id, label: character.name })) ?? [],
  )
  const [characterIds, setCharacterIds] = useState<string[]>(
    work?.characters.map(character => character.id) ?? [],
  )
  const [characterSearch, setCharacterSearch] = useState('')

  const handleCharacterSearch = async(query: string) => {
    setCharacterSearch(query)
    if (!query) return
    const { characters } = await listPublicCharacters({ name: query, per: 20 })
    setCharacterOptions(prev => {
      const byId = new Map(prev.map(option => [option.value, option]))
      for (const { id, name } of characters) byId.set(id, { value: id, label: name })
      return Array.from(byId.values())
    })
  }

  const { mutate: createWork, loading: creating } = useCreateMeWork()
  const { mutate: updateWork, loading: updating } = useDualModeMutation(
    mode, useUpdateMeWork, useUpdateAdminWork,
  )
  const { mutate: resolveApproval, loading: approving } = useResolveWorkApproval()
  const saving = creating || updating || approving

  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string>()

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages(prev => {
      const next = [...prev]
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= next.length) return prev
      ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
      return next
    })
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(image => image.id !== id))
  }

  const handleSubmit = async() => {
    setSaveError(undefined)
    setSaved(false)

    const input: MeWorkUpdateInput = {
      title,
      description: description || null,
      link: link || null,
      tagNames,
      imageIds: images.map(image => image.id),
      characterIds,
      show,
    }

    try {
      if (!work) {
        const { workId } = await createWork({ ...input, title })
        navigate(`/dashboard/me/works/${workId}`)
        return
      }

      await updateWork(work.id, input)
      setSaved(true)
      refetch?.()
    } catch(err) {
      setSaveError(getErrorMessage(err))
    }
  }

  return <Stack>
    <Group>
      <Title order={2}>{work ? work.title : '新增作品'}</Title>
      <Space flex={1}/>
      {work && <WorkVerifyStatusBadge status={work.verifyStatus} />}
      {mode === 'admin' && work && work.verifyStatus !== 'VERIFIED' && (
        <Button
          size="xs" variant="outline" color="green"
          onClick={async() => { await resolveApproval(work.id, 'APPROVE'); refetch?.() }}
        >
          核准
        </Button>
      )}
      {mode === 'admin' && work && work.verifyStatus !== 'REJECTED' && (
        <Button
          size="xs" variant="outline" color="orange"
          onClick={async() => { await resolveApproval(work.id, 'REJECT'); refetch?.() }}
        >
          退回
        </Button>
      )}
    </Group>

    <TextInput
      label="標題" required value={title}
      onChange={e => setTitle(e.currentTarget.value)}
    />
    <Textarea
      label="簡介" value={description} minRows={4} autosize
      onChange={e => setDescription(e.currentTarget.value)}
    />
    <TextInput
      label="外部連結" placeholder="網址" value={link}
      description="可以是你的推文連結、YouTube 影片連結等等"
      onChange={e => setLink(e.currentTarget.value)}
    />
    <TagsInput
      label="標籤" value={tagNames} onChange={setTagNames}
      description="不需 # 字號，可以放置事件標籤、班級標籤、或是其他任何你想要的標籤。"
      placeholder="輸入後按 Enter 新增標籤"
    />
    <MultiSelect
      label="出場角色"
      placeholder="搜尋角色名稱"
      description="標註作品中出現的角色。若作品中有自己，請記得標註自己。"
      data={characterOptions}
      value={characterIds}
      onChange={value => setCharacterIds(value.slice(0, MAX_CHARACTERS_PER_WORK))}
      searchValue={characterSearch}
      onSearchChange={handleCharacterSearch}
      searchable
      maxValues={MAX_CHARACTERS_PER_WORK}
    />

    <Box>
      <Group justify="space-between" mb={4}>
        <Text fw={500}>圖片</Text>
        {images.length < MAX_IMAGES_PER_WORK && mode === 'me' && (
          <ImageSelectorModal
            selected={images}
            onChange={setImages}
            max={MAX_IMAGES_PER_WORK}
          />
        )}
      </Group>
      {images.length === 0
        ? <Text size="sm" c="dimmed">尚未選擇任何圖片。</Text>
        : <Group align="flex-start">
          {images.map((image, index) => <Box key={image.id} w="8rem">
            <ImagePreview src={image.url}>
              <Image src={image.url} h="8rem" fit="cover" radius="sm" />
            </ImagePreview>
            {mode === 'me' && <Group gap={4} mt={4} justify="center">
              <ActionIcon
                variant="default" size="sm" disabled={index === 0}
                onClick={() => moveImage(index, -1)}
              >
                <ArrowUpIcon />
              </ActionIcon>
              <ActionIcon
                variant="default" size="sm" disabled={index === images.length - 1}
                onClick={() => moveImage(index, 1)}
              >
                <ArrowDownIcon />
              </ActionIcon>
              <ActionIcon
                variant="default" color="red" size="sm"
                onClick={() => removeImage(image.id)}
              >
                <TrashIcon />
              </ActionIcon>
            </Group>}
          </Box>)}
        </Group>}
    </Box>

    <Switch
      label="公開顯示" checked={show}
      onChange={e => setShow(e.currentTarget.checked)}
    />

    <Group justify="flex-end">
      {saved && <CheckIcon color="green" />}
      {saveError && <Text c="red">{saveError}</Text>}
      <Button onClick={handleSubmit} loading={saving} disabled={!title}>
        {work ? '儲存' : '新增作品'}
      </Button>
    </Group>
  </Stack>
}

interface WorkEditorProps {
  workId?: string
  mode: 'me' | 'admin'
}

const WorkEditor = ({ workId, mode }: WorkEditorProps) => {
  const { data: work, loading, error, refetch } = useDualModeQuery(
    mode, workId, useMeWork, useAdminWork,
  )

  if (!workId) return <WorkForm mode={mode} />

  if (error) return <Alert color="red">無法載入作品資料。</Alert>
  if (!loading && !work) return <Alert color="red">找不到此作品。</Alert>

  return <Box pos="relative" mih="20rem">
    <LoadingOverlay
      visible={loading}
      zIndex={1000}
      overlayProps={{ radius: 'sm', blur: 2, color: 'transparent' }}
    />
    {work && <WorkForm key={work.id} work={work} mode={mode} refetch={refetch} />}
  </Box>
}

export default WorkEditor
