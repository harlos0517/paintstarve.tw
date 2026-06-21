import Papa from 'papaparse'
import type { PayloadRequest } from 'payload'

const FIELDS = [
  'id', 'studentId', 'name', 'nameEn', 'year', 'class',
  'gender', 'race', 'major', 'seatRow', 'seatColumn', 'description',
] as const

export async function exportStudentsCSV(req: PayloadRequest) {
  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { docs } = await req.payload.find({
    collection: 'students',
    pagination: false,
  })

  const csv = Papa.unparse(
    docs.map(doc => ({
      id: doc.id,
      studentId: doc.studentId ?? '',
      name: doc.name ?? '',
      nameEn: doc.nameEn ?? '',
      year: doc.year ?? '',
      class: doc.class ?? '',
      gender: doc.gender ?? '',
      race: doc.race ?? '',
      major: doc.major ?? '',
      seatRow: doc.seatRow ?? '',
      seatColumn: doc.seatColumn ?? '',
      description: doc.description ?? '',
    })),
    { columns: [...FIELDS] },
  )

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="students.csv"',
    },
  })
}

export async function importStudentsCSV(req: PayloadRequest) {
  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData?.()
  const file = formData?.get('file') as File | null

  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 })
  }

  const text = await file.text()
  const { data, errors } = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  })

  if (errors.length > 0) {
    return Response.json({ error: 'CSV 解析失敗', details: errors }, { status: 400 })
  }

  let created = 0
  let updated = 0
  const failed: { row: number; error: string }[] = []

  for (const [i, row] of data.entries()) {
    const rowData = {
      name: row.name || undefined,
      nameEn: row.nameEn || undefined,
      studentId: row.studentId || undefined,
      year: row.year ? Number(row.year) : undefined,
      class: row.class || undefined,
      gender: row.gender || undefined,
      race: row.race || undefined,
      major: row.major || undefined,
      seatRow: row.seatRow ? Number(row.seatRow) : undefined,
      seatColumn: row.seatColumn ? Number(row.seatColumn) : undefined,
      description: row.description || undefined,
    }

    try {
      if (row.id) {
        await req.payload.update({ collection: 'students', id: row.id, data: rowData })
        updated++
      } else {
        await req.payload.create({ collection: 'students', data: rowData })
        created++
      }
    } catch (e) {
      failed.push({ row: i + 2, error: String(e) })
    }
  }

  return Response.json({ created, updated, failed })
}
