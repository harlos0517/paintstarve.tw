export interface Students {
  name: string
  nameEn: string
  studentId: string
  year: number
  class: string
  gender: string
  race: string
  major: string
  seatRow: number
  seatColumn: number
  description: string
}

export enum Sheet {
  STUDENTS = 'STUDENTS',
}

export interface DataTypeMap {
  [Sheet.STUDENTS]: Students
}
