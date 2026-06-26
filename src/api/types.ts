export interface Student {
  id: string
  name: string
  nameEn: string
  studentId: string
  year: number // 1 - 3
  class: string // A - G
  seatRow: number // 1 - 8
  seatColumn: number // 1 - 5
  race: string
  major: string
  birthday: string // MM-DD
  description: string // multiline
  twitter: string
  idCardImageUrl: string
}

export enum Sheet {
  STUDENTS = 'STUDENTS',
}

export interface DataTypeMap {
  [Sheet.STUDENTS]: Student
}
