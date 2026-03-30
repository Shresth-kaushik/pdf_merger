import { useState, useRef } from 'react'
import styles from './ImageDropZone.module.css'

export default function ImageDropZone({ onImages, label = 'Drop images here', sub = 'PNG, JPG, WEBP supported' }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)
  const dragCounter = useRef(0)

  const handleDragEnter = (e) => { e.preventDefault(); dragCounter.current++; setDragging(true) }
  const handleDragLeave = (e) => { e.preventDefault(); dragCounter.current--; if (dragCounter.current === 0) setDragging(false) }
  const handleDragOver = (e) => e.preventDefault()
  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false); dragCounter.current = 0
    onImages(Array.from(e.dataTransfer.files))
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
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        className={styles.input}
        onChange={e => onImages(Array.from(e.target.files))}
        onClick={e => e.stopPropagation()}
      />
      <div className={styles.iconWrap}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        {dragging && <div className={styles.pulse} />}
      </div>
      <h3 className={styles.title}>{dragging ? 'Drop images' : label}</h3>
      <p className={styles.sub}>{sub} · <span className={styles.link}>click to browse</span></p>
    </div>
  )
}
