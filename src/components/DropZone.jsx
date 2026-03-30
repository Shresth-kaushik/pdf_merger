import { useState, useRef } from 'react'
import styles from './DropZone.module.css'

export default function DropZone({ onFiles, onImages, acceptImages = false }) {
  const [dragging, setDragging] = useState(false)
  const pdfInputRef = useRef(null)
  const imgInputRef = useRef(null)
  const dragCounter = useRef(0)

  const handleDragEnter = (e) => { e.preventDefault(); dragCounter.current++; setDragging(true) }
  const handleDragLeave = (e) => { e.preventDefault(); dragCounter.current--; if (dragCounter.current === 0) setDragging(false) }
  const handleDragOver = (e) => e.preventDefault()
  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false); dragCounter.current = 0
    const all = Array.from(e.dataTransfer.files)
    const pdfs = all.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
    const imgs = all.filter(f => ['image/jpeg','image/jpg','image/png','image/webp'].includes(f.type))
    if (pdfs.length) onFiles(pdfs)
    if (imgs.length && acceptImages && onImages) onImages(imgs)
  }

  return (
    <div
      className={`${styles.zone} ${dragging ? styles.active : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="presentation"
    >
      <input ref={pdfInputRef} type="file" accept=".pdf,application/pdf" multiple className={styles.input}
        onChange={e => onFiles(Array.from(e.target.files))} onClick={e => e.stopPropagation()} />
      {acceptImages && (
        <input ref={imgInputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple className={styles.input}
          onChange={e => onImages && onImages(Array.from(e.target.files))} onClick={e => e.stopPropagation()} />
      )}

      <div className={styles.iconWrap} onClick={() => pdfInputRef.current?.click()} style={{ cursor: 'pointer' }}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        {dragging && <div className={styles.pulse} />}
      </div>

      <h2 className={styles.title}>{dragging ? 'Drop files here' : 'Drop files here'}</h2>

      <div className={styles.btns}>
        <button className={styles.browseBtn} onClick={() => pdfInputRef.current?.click()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          Add PDFs
        </button>
        {acceptImages && (
          <button className={`${styles.browseBtn} ${styles.imgBtn}`} onClick={() => imgInputRef.current?.click()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Add Images
          </button>
        )}
      </div>

      <p className={styles.hint}>
        {acceptImages ? 'PDFs & images accepted · drag or click buttons above' : 'Only .pdf files accepted · drag or click above'}
      </p>
    </div>
  )
}
