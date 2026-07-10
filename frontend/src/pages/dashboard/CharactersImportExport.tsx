import {
  Alert, Anchor, Badge, Button, FileInput, Group, ScrollArea, Stack, Table, Text, Title,
} from '@mantine/core'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { getErrorMessage } from '@/api/backendClient'
import { ImportCharactersResult } from '@/api/characters'
import AdminOnly from '@/components/dashboard/AdminOnly'
import { useExportCharactersCsv, useImportCharactersCsv } from '@/hooks/useCharacters'

const downloadCsv = (csv: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `characters-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const DashboardCharactersImportExportContent = () => {
  const { mutate: doExport, loading: exporting } = useExportCharactersCsv()
  const { mutate: doImport, loading: importing } = useImportCharactersCsv()

  const [exportError, setExportError] = useState<string>()
  const [file, setFile] = useState<File | null>(null)
  const [importError, setImportError] = useState<string>()
  const [result, setResult] = useState<ImportCharactersResult>()

  const handleExport = async() => {
    setExportError(undefined)
    try {
      const csv = await doExport()
      downloadCsv(csv)
    } catch(err) {
      setExportError(getErrorMessage(err))
    }
  }

  const handleImport = async() => {
    if (!file) return
    setImportError(undefined)
    setResult(undefined)
    try {
      const importResult = await doImport(file)
      setResult(importResult)
      setFile(null)
    } catch(err) {
      setImportError(getErrorMessage(err))
    }
  }

  return <Stack>
    <Anchor component={Link} to="/dashboard/characters">← 返回角色列表</Anchor>
    <Title order={2}>角色資料匯入 / 匯出</Title>

    <Stack gap="xs">
      <Text fw={700}>匯出</Text>
      <Text size="sm" c="dimmed">下載目前所有角色資料的 CSV 檔案。</Text>
      {exportError && <Alert color="red">{exportError}</Alert>}
      <Group>
        <Button onClick={handleExport} loading={exporting}>下載 CSV</Button>
      </Group>
    </Stack>

    <Stack gap="xs" mt="md">
      <Text fw={700}>匯入</Text>
      <Text size="sm" c="dimmed">
        上傳 CSV 檔案以批次新增或更新角色。有 id 欄位且對應到現有角色的資料列會更新該角色，
        其餘則會新增為新角色（未指定所屬使用者時，會歸屬到執行匯入的帳號）。
        不存在於資料表的欄位會被忽略；個別資料列若有問題，只會列在下方錯誤清單中，
        不影響其餘資料列的匯入。
      </Text>
      <FileInput
        label="CSV 檔案" placeholder="選擇檔案" accept=".csv,text/csv"
        value={file} onChange={setFile}
      />
      {importError && <Alert color="red">{importError}</Alert>}
      <Group>
        <Button onClick={handleImport} loading={importing} disabled={!file}>開始匯入</Button>
      </Group>

      {result && <Stack gap="xs">
        <Group>
          <Badge color="green" variant="light">新增 {result.created} 筆</Badge>
          <Badge color="blue" variant="light">更新 {result.updated} 筆</Badge>
          {result.errors.length > 0 &&
            <Badge color="red" variant="light">錯誤 {result.errors.length} 筆</Badge>}
        </Group>
        {result.errors.length > 0 && <ScrollArea h="20rem">
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>行數</Table.Th>
                <Table.Th>錯誤訊息</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {result.errors.map((rowError, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{rowError.row}</Table.Td>
                  <Table.Td>{rowError.message}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>}
      </Stack>}
    </Stack>
  </Stack>
}

const DashboardCharactersImportExport = () => (
  <AdminOnly><DashboardCharactersImportExportContent /></AdminOnly>
)

export default DashboardCharactersImportExport
