import { useState, useCallback } from 'react'
import { PDFDocument } from 'pdf-lib'

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

export function useImageToPdf() {
  const [images, setImages] = useState([])
  const [status, setStatus] = useState('idle') // idle | processing | done | error
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  const addImages = useCallback(async (newFiles) => {
    const imgs = Array.from(newFiles).filter(f => IMAGE_TYPES.includes(f.type))
    const loaded = await Promise.all(
      imgs.map(async (file) => {
        const data = await file.arrayBuffer()
        const previewUrl = URL.createObjectURL(file)
        return {
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          data,
          previewUrl,
        }
      })
    )
    setImages(prev => [...prev, ...loaded])
    setStatus('idle')
  }, [])

  const removeImage = useCallback((id) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id)
      if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl)
      return prev.filter(i => i.id !== id)
    })
    setStatus('idle')
  }, [])

  const reorderImages = useCallback((newImages) => {
    setImages(newImages)
  }, [])

  const clearAll = useCallback(() => {
    setImages(prev => {
      prev.forEach(i => { if (i.previewUrl) URL.revokeObjectURL(i.previewUrl) })
      return []
    })
    setStatus('idle')
    setProgress(0)
    setErrorMsg('')
  }, [])

  const convert = useCallback(async (outputName, pageSize = 'fit') => {
    if (images.length === 0) return
    setStatus('processing')
    setProgress(0)
    setErrorMsg('')

    try {
      const pdf = await PDFDocument.create()

      for (let i = 0; i < images.length; i++) {
        setProgress(Math.round((i / images.length) * 90))
        const img = images[i]
        let embedded

        if (img.type === 'image/png') {
          embedded = await pdf.embedPng(img.data)
        } else {
          // jpeg / webp / gif → embed as jpeg
          embedded = await pdf.embedJpg(img.data)
        }

        const { width, height } = embedded

        let pageW, pageH
        if (pageSize === 'a4') {
          pageW = 595.28; pageH = 841.89
        } else if (pageSize === 'letter') {
          pageW = 612; pageH = 792
        } else {
          // fit: page = image dimensions
          pageW = width; pageH = height
        }

        const page = pdf.addPage([pageW, pageH])

        // Scale image to fit the page while preserving aspect ratio
        const scale = Math.min(pageW / width, pageH / height)
        const drawW = width * scale
        const drawH = height * scale
        const x = (pageW - drawW) / 2
        const y = (pageH - drawH) / 2

        page.drawImage(embedded, { x, y, width: drawW, height: drawH })
      }

      setProgress(96)
      const bytes = await pdf.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      const name = (outputName || 'images-to-pdf').trim()
      a.download = name.endsWith('.pdf') ? name : `${name}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 5000)

      setProgress(100)
      setStatus('done')
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Conversion failed. Please try again.')
      setStatus('error')
      setProgress(0)
    }
  }, [images])

  const totalSize = images.reduce((s, i) => s + i.size, 0)

  return {
    images,
    status,
    progress,
    errorMsg,
    totalSize,
    addImages,
    removeImage,
    reorderImages,
    clearAll,
    convert,
  }
}
