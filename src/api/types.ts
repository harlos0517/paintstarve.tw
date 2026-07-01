export interface Participant {
  uid: string
  season: number
  seatId: string
  role: string
  name: string
  nameEn: string
  cardId: string
  year: number // 1 - 3
  class: string // A - G
  seatRow: number // 1 - 8
  seatColumn: number // 1 - 5
  title: string
  unit: string
  race: string
  major: string
  birthday: string // MM-DD
  description: string // multiline
  twitter: string
  idCardImageUrl: string
  verified: boolean
}

export enum Sheet {
  PARTICIPANTS = 'STUDENTS',
}

export interface DataTypeMap {
  [Sheet.PARTICIPANTS]: Participant
}
