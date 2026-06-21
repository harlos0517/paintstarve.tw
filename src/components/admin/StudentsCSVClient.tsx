'use client'

import { useState } from 'react'

type ImportResult = {
  created: number
  updated: number
  failed: { row: number; error: string }[]
}

export default function StudentsCSVClient({ token }: { token: string | null }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleImport() {
    if (!file) return
    setLoading(true)
    setResult(null)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/students/import-csv', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '未知錯誤')
      } else {
        setResult(data)
        setFile(null)
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="gutter--left gutter--right" style={{ paddingTop: '2rem', paddingBottom: '2rem', maxWidth: 640 }}>
      <h1 className="doc-header__title">Students CSV 匯入／匯出</h1>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>匯出</h2>
        <p className="field-description">下載目前所有學生資料為 CSV 檔</p>
        <a
          href="/api/students/export-csv"
          className="btn btn--style-primary btn--size-medium"
          style={{ display: 'inline-block', marginTop: '0.75rem' }}
        >
          下載 students.csv
        </a>
      </section>

      <hr style={{ margin: '2rem 0', borderColor: 'var(--theme-elevation-100)' }} />

      <section>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>匯入</h2>
        <p className="field-description">
          CSV 第一行須為 header。包含 <code>id</code> 欄位時更新既有資料，省略時新增。<br />
          支援欄位：id, studentId, name, nameEn, year, class, gender, race, major, seatRow, seatColumn, description
        </p>

        <div style={{ marginTop: '1rem' }}>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
            style={{ display: 'block', marginBottom: '0.75rem' }}
          />
          <button
            className="btn btn--style-primary btn--size-medium"
            onClick={handleImport}
            disabled={!file || loading}
          >
            {loading ? '匯入中…' : '開始匯入'}
          </button>
        </div>

        {error && (
          <div className="banner banner--style-error" style={{ marginTop: '1rem' }}>
            {error}
          </div>
        )}

        {result && (
          <div
            className={`banner banner--style-${result.failed.length === 0 ? 'success' : 'warning'}`}
            style={{ marginTop: '1rem' }}
          >
            <p>新增：{result.created} 筆　更新：{result.updated} 筆</p>
            {result.failed.length > 0 && (
              <>
                <p>失敗：{result.failed.length} 筆</p>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                  {result.failed.map(f => (
                    <li key={f.row}>第 {f.row} 行：{f.error}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
