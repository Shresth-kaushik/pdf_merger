import { useState } from 'react'
import styles from './ImageGrid.module.css'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

export default function ImageGrid({ images, onRemove, onReorder }) {
  const [dragSrc, setDragSrc] = useState(null)
  const [dragTarget, setDragTarget] = useState(null)

  if (images.length === 0) return null

  const handleDragEnd = () => {
    if (dragSrc !== null && dragTarget !== null && dragSrc !== dragTarget) {
      const next = [...images]
      const [moved] = next.splice(dragSrc, 1)
      next.splice(dragTarget, 0, moved)
      onReorder(next)
    }
    setDragSrc(null)
    setDragTarget(null)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.label}>Images to convert</span>
        <span className={styles.badge}>{images.length} {images.length === 1 ? 'image' : 'images'}</span>
      </div>

      <div className={styles.grid}>
        {images.map((img, i) => (
          <div
            key={img.id}
            className={`${styles.card} ${dragSrc === i ? styles.dragging : ''} ${dragTarget === i && dragSrc !== i ? styles.target : ''}`}
            draggable
            onDragStart={() => setDragSrc(i)}
            onDragEnter={() => setDragTarget(i)}
            onDragEnd={handleDragEnd}
            onDragOver={e => e.preventDefault()}
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className={styles.thumb}>
              <img src={img.previewUrl} alt={img.name} />
              <div className={styles.overlay}>
                <span className={styles.pageNum}>{i + 1}</span>
              </div>
            </div>
            <div className={styles.info}>
              <span className={styles.name} title={img.name}>{img.name}</span>
              <span className={styles.size}>{formatSize(img.size)}</span>
            </div>
            <button
              className={styles.removeBtn}
              onClick={() => onRemove(img.id)}
              title="Remove"
              aria-label={`Remove ${img.name}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <p className={styles.hint}>↔ Drag cards to reorder — PDF pages follow this sequence</p>
    </div>
  )
}
