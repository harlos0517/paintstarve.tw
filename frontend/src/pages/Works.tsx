import {
  Alert,
  Center,
  Container,
  Group,
  Loader,
  MultiSelect,
  Pagination,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useState } from 'react'

import AspectRatioViewControl from '@/components/AspectRatioViewControl'
import WorkListCard from '@/components/WorkListCard'
import { usePagination } from '@/hooks/usePagination'
import { usePublicWorks, usePublicWorkTags } from '@/hooks/useWorks'
import { ASPECT_RATIO_BY_VIEW, BaseAspectRatioView } from '@/lib/aspectRatioViews'

const VIEWS: BaseAspectRatioView[] = ['16:9', '4:3', '1:1', '3:4', '9:16']

const Works = () => {
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState<string | null>(null)
  const { page, setPage, per, totalPages } = usePagination(18)
  const [view, setView] = useState<BaseAspectRatioView>('1:1')

  const { data: tags } = usePublicWorkTags()

  const filters = {
    title: title || undefined,
    tag: tag ?? undefined,
    page,
    per,
  }
  const { data, loading, error } = usePublicWorks(filters)

  return <Container p="md" size="1440px">
    <Stack>
      <Title order={2}>作品</Title>

      <Group wrap="nowrap">
        <TextInput
          flex="1"
          label="搜尋標題"
          value={title}
          onChange={e => { setTitle(e.currentTarget.value); setPage(1) }}
        />
        <MultiSelect
          flex="1"
          label="標籤"
          data={tags ?? []}
          value={tag ? [tag] : []}
          onChange={value => { setTag(value[0] ?? null); setPage(1) }}
          maxValues={1}
          clearable
        />
      </Group>

      <AspectRatioViewControl views={VIEWS} value={view} onChange={setView} />

      {Boolean(error) && <Alert color="red">無法載入作品列表。</Alert>}

      {loading
        ? <Center h="30vh"><Loader /></Center>
        : <SimpleGrid cols={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
          {data?.works.map(work => <WorkListCard
            key={work.id}
            {...work}
            aspectRatio={ASPECT_RATIO_BY_VIEW[view]}
          />)}
        </SimpleGrid>}

      <Group justify="center">
        <Pagination value={page} onChange={setPage} total={totalPages(data?.total)} />
      </Group>
    </Stack>
  </Container>
}

export default Works
