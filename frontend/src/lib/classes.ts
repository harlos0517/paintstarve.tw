export const classes = [
  { year: 1, class: 'A', rows: 7 },
  { year: 1, class: 'B', rows: 7 },
  { year: 1, class: 'C', rows: 7 },
  { year: 1, class: 'D', rows: 7 },
  { year: 1, class: 'E', rows: 8 },
  { year: 1, class: 'F', rows: 7 },
  { year: 1, class: 'G', rows: 7 },
  { year: 2, class: 'A', rows: 7 },
  { year: 2, class: 'B', rows: 7 },
  { year: 2, class: 'C', rows: 7 },
  { year: 2, class: 'D', rows: 7 },
  { year: 2, class: 'E', rows: 8 },
  { year: 2, class: 'F', rows: 7 },
  { year: 2, class: 'G', rows: 7 },
  { year: 3, class: 'A', rows: 7 },
  { year: 3, class: 'B', rows: 7 },
  { year: 3, class: 'C', rows: 7 },
  { year: 3, class: 'D', rows: 7 },
  { year: 3, class: 'E', rows: 8 },
  { year: 3, class: 'F', rows: 7 },
  { year: 3, class: 'G', rows: 7 },
]

export const YEARS = [1, 2, 3]

export const getClass = (year: number, clazz: string) =>
  classes.find(c => c.year === year && c.class === clazz)

export const getPath = (year: number, clazz: string) => `/class/${year}${clazz}`

export const YEAR_MAP: Record<number, string> = {
  1: '一',
  2: '二',
  3: '三',
}

export const YEAR_COLOR_MAP: Record<number, string> = {
  1: 'red',
  2: 'green',
  3: 'blue',
}

export const getName = (year: number, clazz: string) => `${YEAR_MAP[year]}年 ${clazz} 班`

export const getColor = (year: number) => YEAR_COLOR_MAP[year]

export const ROWS = [1, 2, 3, 4, 5, 6, 7, 8]

export const COLS = [1, 2, 3, 4, 5]
