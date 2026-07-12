import { SegmentedControl } from '@mantine/core'

interface AspectRatioViewControlProps<T extends string> {
  views: readonly T[]
  value: T
  onChange: (value: T) => void
}

// Shared by every page that lets the user pick a thumbnail aspect ratio
// (MeImages.tsx, Works.tsx) - each page still owns its own ratio-by-view map
// since the available views/order differ (e.g. MeImages adds a "證件" option).
const AspectRatioViewControl = <T extends string>(
  { views, value, onChange }: AspectRatioViewControlProps<T>,
) => <SegmentedControl
  value={value}
  onChange={v => onChange(v as T)}
  data={[...views]}
  w="fit-content"
/>

export default AspectRatioViewControl
