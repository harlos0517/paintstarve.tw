export const ASPECT_RATIO_BY_VIEW = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '1:1': 1,
  '3:4': 3 / 4,
  '9:16': 9 / 16,
} as const

export type BaseAspectRatioView = keyof typeof ASPECT_RATIO_BY_VIEW
