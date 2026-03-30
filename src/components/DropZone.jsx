import { useState, useRef } from 'react'
import styles from './DropZone.module.css'

export default function DropZone({ onFiles }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)
  const dragCounter = useRef(0)

  const handleDragEnter = (e) => {
    e.preventDefault()
    dragCounter.current++
    if (e.dataTransfer.items?.length > 0) setDragging(true)
  }
  const handleDragLeave = (e) => {
    e.preventDefault()
    dragCounter.current--
    if (dragCounter.current === 0) setDragging(false)
  }
  const handleDragOver = (e) => { e.preventDefault() }
  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    dragCounter.current = 0
    const files = Array.from(e.dataTransfer.files)
    if (files.length) onFiles(files)
  }

  return (
    <div
      className={`${styles.zone} ${dragging ? styles.active : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      aria-label="Upload PDF files"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple
        className={styles.input}
        onChange={e => onFiles(Array.from(e.target.files))}
        onClick={e => e.stopPropagation()}
      />

      <div className={styles.iconWrap}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        {dragging && <div className={styles.pulse} />}
      </div>

      <h2 className={styles.title}>
        {dragging ? 'Drop to add PDFs' : 'Drop PDFs here'}
      </h2>
      <p className={styles.sub}>
        Drag &amp; drop multiple files, or <span className={styles.link}>click to browse</span>
      </p>
      <p className={styles.hint}>Only .pdf files are accepted</p>
    </div>
  )
}
