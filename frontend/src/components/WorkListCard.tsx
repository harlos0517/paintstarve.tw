import {
  Badge,
  Card,
  Group,
  Image,
  Modal,
  Stack,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { LinkIcon } from '@phosphor-icons/react'

import { Work } from '@/api/works'
import PublicCarousel from '@/components/PublicCarousel'

interface WorkListCardProps extends Work {
  aspectRatio?: number
}

const WorkListCard = ({ aspectRatio = 1, ...work }: WorkListCardProps) => {
  const [opened, { open, close }] = useDisclosure(false)
  const coverUrl = work.imageUrls[0]

  return <>
    <Card
      shadow="sm" radius="md" padding="sm" withBorder
      style={{ cursor: 'pointer' }}
      onClick={open}
    >
      <Card.Section>
        <PublicCarousel
          items={work.imageUrls.map(url => ({
            key: url,
            element: <Image src={url} alt={work.title} fit="cover" />,
          }))}
          mode="auto"
          delay={4000}
          aspectRatio={aspectRatio}
        />
      </Card.Section>
      <Stack gap={4} mt="sm">
        <Group gap="0.25rem">
          <Text fw={600} lineClamp={1}>{work.title}</Text>
          <Text size="sm" c="dimmed">- {work.author.name}</Text>
        </Group>
        {work.tags.length > 0 && (
          <Group gap={4}>
            {work.tags.map(tag => (
              <Badge key={tag} size="sm" variant="light">{tag}</Badge>
            ))}
          </Group>
        )}
      </Stack>
    </Card>

    <Modal opened={opened} onClose={close} title={work.title} size="lg" centered>
      <Stack>
        {work.imageUrls.length > 1
          ? <PublicCarousel
            items={work.imageUrls.map(url => ({
              key: url,
              element: <Image src={url} alt={work.title} fit="cover" radius="sm" />,
            }))}
            mode="controlled"
            delay={4000}
          />
          : coverUrl && <Image src={coverUrl} fit="contain" radius="sm" />}

        <Text size="sm" c="dimmed">by {work.author.name}</Text>

        {work.description && <Text component="pre">{work.description}</Text>}

        {work.link && (
          <Group gap={4}>
            <LinkIcon />
            <Text
              component="a" href={work.link} target="_blank" rel="noreferrer"
              size="sm" c="blue"
            >
              {work.link}
            </Text>
          </Group>
        )}

        {work.characters.length > 0 && (
          <Group gap={4}>
            {work.characters.map(character => (
              <Badge key={character.id} variant="outline">{character.name}</Badge>
            ))}
          </Group>
        )}

        {work.tags.length > 0 && (
          <Group gap={4}>
            {work.tags.map(tag => (
              <Badge key={tag} size="sm" variant="light">{tag}</Badge>
            ))}
          </Group>
        )}
      </Stack>
    </Modal>
  </>
}

export default WorkListCard
