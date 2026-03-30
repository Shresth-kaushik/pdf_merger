import { useState, useCallback } from 'react'
import { PDFDocument } from 'pdf-lib'

export function usePdfMerger() {
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState('idle') // idle | merging | done | error
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  const addFiles = useCallback(async (newFiles) => {
    const pdfs = Array.from(newFiles).filter(f =>
      f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    )

    const loaded = await Promise.all(
      pdfs.map(async (file) => {
        const data = await file.arrayBuffer()
        // Quick peek to get page count
        let pages = '?'
        try {
          const doc = await PDFDocument.load(data, { ignoreEncryption: true })
          pages = doc.getPageCount()
        } catch (_) {}
        return {
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          pages,
          data,
        }
      })
    )

    setFiles(prev => [...prev, ...loaded])
    setStatus('idle')
  }, [])

  const removeFile = useCallback((id) => {
    setFiles(prev => prev.filter(f => f.id !== id))
    setStatus('idle')
  }, [])

  const reorderFiles = useCallback((newFiles) => {
    setFiles(newFiles)
  }, [])

  const clearAll = useCallback(() => {
    setFiles([])
    setStatus('idle')
    setProgress(0)
    setErrorMsg('')
  }, [])

  const merge = useCallback(async (outputName) => {
    if (files.length < 1) return
    setStatus('merging')
    setProgress(0)
    setErrorMsg('')

    try {
      const merged = await PDFDocument.create()

      for (let i = 0; i < files.length; i++) {
        const pct = Math.round(((i) / files.length) * 90)
        setProgress(pct)
        const src = await PDFDocument.load(files[i].data, { ignoreEncryption: true })
        const pageIndices = src.getPageIndices()
        const copied = await merged.copyPages(src, pageIndices)
        copied.forEach(p => merged.addPage(p))
      }

      setProgress(95)
      const bytes = await merged.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      const name = (outputName || 'merged-notes').trim()
      a.download = name.endsWith('.pdf') ? name : `${name}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 5000)

      setProgress(100)
      setStatus('done')
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Merge failed. Please try again.')
      setStatus('error')
      setProgress(0)
    }
  }, [files])

  const totalSize = files.reduce((s, f) => s + f.size, 0)
  const totalPages = files.reduce((s, f) => s + (typeof f.pages === 'number' ? f.pages : 0), 0)

  return {
    files,
    status,
    progress,
    errorMsg,
    totalSize,
    totalPages,
    addFiles,
    removeFile,
    reorderFiles,
    clearAll,
    merge,
  }
}
