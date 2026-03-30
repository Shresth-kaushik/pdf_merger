import { useState } from 'react'
import styles from './FileList.module.css'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function ImgIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

function FileItem({ file, index, total, onRemove, onDragStart, onDragEnter, onDragEnd, isDragging, isTarget }) {
  const isImage = file.kind === 'image'
  return (
    <div
      className={`${styles.item} ${isDragging ? styles.dragging : ''} ${isTarget ? styles.target : ''}`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={e => e.preventDefault()}
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className={styles.handle}><span /><span /><span /></div>

      {isImage && file.previewUrl ? (
        <div className={`${styles.fileIcon} ${styles.imgThumb}`}>
          <img src={file.previewUrl} alt={file.name} />
        </div>
      ) : (
        <div className={`${styles.fileIcon} ${isImage ? styles.imgIcon : styles.pdfIcon}`}>
          {isImage ? <ImgIcon /> : <PdfIcon />}
        </div>
      )}

      <div className={styles.info}>
        <div className={styles.name} title={file.name}>{file.name}</div>
        <div className={styles.meta}>
          {formatSize(file.size)}
          <span className={`${styles.kindBadge} ${isImage ? styles.kindImg : styles.kindPdf}`}>
            {isImage ? 'image' : `${file.pages} ${file.pages === 1 ? 'page' : 'pages'}`}
          </span>
        </div>
      </div>

      <div className={styles.order}>{index + 1} / {total}</div>

      <button className={styles.removeBtn} onClick={() => onRemove(file.id)} title="Remove" aria-label={`Remove ${file.name}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

export default function FileList({ files, onRemove, onReorder }) {
  const [dragSrc, setDragSrc] = useState(null)
  const [dragTarget, setDragTarget] = useState(null)

  const handleDragEnd = () => {
    if (dragSrc !== null && dragTarget !== null && dragSrc !== dragTarget) {
      const next = [...files]
      const [moved] = next.splice(dragSrc, 1)
      next.splice(dragTarget, 0, moved)
      onReorder(next)
    }
    setDragSrc(null)
    setDragTarget(null)
  }

  if (files.length === 0) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.label}>Files to merge</span>
        <span className={styles.badge}>{files.length} {files.length === 1 ? 'item' : 'items'}</span>
      </div>
      <div className={styles.list}>
        {files.map((file, i) => (
          <FileItem
            key={file.id}
            file={file}
            index={i}
            total={files.length}
            onRemove={onRemove}
            onDragStart={setDragSrc}
            onDragEnter={setDragTarget}
            onDragEnd={handleDragEnd}
            isDragging={dragSrc === i}
            isTarget={dragTarget === i && dragSrc !== i}
          />
        ))}
      </div>
      <p className={styles.hint}>↕ Drag rows to reorder — merged PDF follows this sequence</p>
    </div>
  )
}
