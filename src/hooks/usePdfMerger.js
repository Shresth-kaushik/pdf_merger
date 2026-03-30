import { useState, useCallback } from 'react'
import { PDFDocument } from 'pdf-lib'

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export function usePdfMerger() {
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  const addFiles = useCallback(async (newFiles) => {
    const pdfs = Array.from(newFiles).filter(f =>
      f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    )
    const loaded = await Promise.all(
      pdfs.map(async (file) => {
        const data = await file.arrayBuffer()
        let pages = '?'
        try {
          const doc = await PDFDocument.load(data, { ignoreEncryption: true })
          pages = doc.getPageCount()
        } catch (_) {}
        return {
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
          kind: 'pdf',
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

  const addImages = useCallback(async (newFiles) => {
    const imgs = Array.from(newFiles).filter(f => IMAGE_TYPES.includes(f.type))
    const loaded = await Promise.all(
      imgs.map(async (file) => {
        const data = await file.arrayBuffer()
        const previewUrl = URL.createObjectURL(file)
        return {
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
          kind: 'image',
          name: file.name,
          size: file.size,
          pages: 1,
          type: file.type,
          data,
          previewUrl,
        }
      })
    )
    setFiles(prev => [...prev, ...loaded])
    setStatus('idle')
  }, [])

  const removeFile = useCallback((id) => {
    setFiles(prev => {
      const item = prev.find(f => f.id === id)
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl)
      return prev.filter(f => f.id !== id)
    })
    setStatus('idle')
  }, [])

  const reorderFiles = useCallback((newFiles) => setFiles(newFiles), [])

  const clearAll = useCallback(() => {
    setFiles(prev => {
      prev.forEach(f => { if (f.previewUrl) URL.revokeObjectURL(f.previewUrl) })
      return []
    })
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
        setProgress(Math.round((i / files.length) * 90))
        const item = files[i]

        if (item.kind === 'pdf') {
          const src = await PDFDocument.load(item.data, { ignoreEncryption: true })
          const copied = await merged.copyPages(src, src.getPageIndices())
          copied.forEach(p => merged.addPage(p))
        } else {
          let embedded
          if (item.type === 'image/png') {
            embedded = await merged.embedPng(item.data)
          } else {
            embedded = await merged.embedJpg(item.data)
          }
          const { width, height } = embedded
          const page = merged.addPage([width, height])
          page.drawImage(embedded, { x: 0, y: 0, width, height })
        }
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

  return { files, status, progress, errorMsg, totalSize, totalPages, addFiles, addImages, removeFile, reorderFiles, clearAll, merge }
}
