import { useState } from 'react'
import styles from './ImageToPdfSidebar.module.css'

function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

export default function ImageToPdfSidebar({ images, totalSize, status, progress, errorMsg, onConvert, onClear }) {
  const [outputName, setOutputName] = useState('images-to-pdf')
  const [pageSize, setPageSize] = useState('fit')

  const isEmpty = images.length === 0
  const isProcessing = status === 'processing'
  const isDone = status === 'done'
  const isError = status === 'error'

  const statusLabel = {
    idle: isEmpty ? 'Waiting' : 'Ready',
    processing: 'Converting…',
    done: 'Complete ✓',
    error: 'Error',
  }[status]

  return (
    <aside className={styles.sidebar}>

      {/* Summary */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>Summary</div>
        <div className={styles.stats}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Images added</span>
            <span className={styles.statVal}>{images.length}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>PDF pages</span>
            <span className={styles.statVal}>{images.length || '—'}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Total size</span>
            <span className={styles.statVal}>{formatSize(totalSize)}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Status</span>
            <span className={`${styles.statVal} ${
              status === 'idle' ? (isEmpty ? styles.statusWaiting : styles.statusReady)
              : status === 'processing' ? styles.statusMerging
              : status === 'done' ? styles.statusDone
              : styles.statusError
            }`}>{statusLabel}</span>
          </div>
        </div>
      </div>

      {/* Page size */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Page size</label>
        <div className={styles.segmented}>
          {[
            { value: 'fit', label: 'Fit image' },
            { value: 'a4',  label: 'A4' },
            { value: 'letter', label: 'Letter' },
          ].map(opt => (
            <button
              key={opt.value}
              className={`${styles.seg} ${pageSize === opt.value ? styles.segActive : ''}`}
              onClick={() => setPageSize(opt.value)}
              disabled={isProcessing}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className={styles.sizeHint}>
          {pageSize === 'fit' && 'Each page matches the image dimensions exactly'}
          {pageSize === 'a4' && 'Images scaled to fit A4 (595 × 842 pt)'}
          {pageSize === 'letter' && 'Images scaled to fit US Letter (612 × 792 pt)'}
        </p>
      </div>

      {/* Filename */}
      <div className={styles.inputGroup}>
        <label htmlFor="img-output-name" className={styles.inputLabel}>Output filename</label>
        <div className={styles.inputWrapper}>
          <input
            id="img-output-name"
            type="text"
            value={outputName}
            onChange={e => setOutputName(e.target.value)}
            placeholder="images-to-pdf"
            className={styles.input}
            disabled={isProcessing}
          />
          <span className={styles.ext}>.pdf</span>
        </div>
      </div>

      {/* Progress */}
      {isProcessing && (
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.progressLabel}>{progress}%</span>
        </div>
      )}

      {isDone && (
        <div className={styles.successBanner}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>PDF downloaded successfully!</span>
        </div>
      )}

      {isError && (
        <div className={styles.errorBanner}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMsg || 'Something went wrong.'}</span>
        </div>
      )}

      <button
        className={`${styles.convertBtn} ${isProcessing ? styles.processingState : ''}`}
        disabled={isEmpty || isProcessing}
        onClick={() => onConvert(outputName, pageSize)}
      >
        {isProcessing ? (
          <><span className={styles.spinner} />Converting…</>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Convert to PDF
          </>
        )}
      </button>

      {!isEmpty && (
        <button className={styles.clearBtn} onClick={onClear} disabled={isProcessing}>
          Clear all images
        </button>
      )}

      <div className={styles.tips}>
        <h4 className={styles.tipsTitle}>Supported formats</h4>
        <ul className={styles.tipsList}>
          <li>PNG — best for screenshots & diagrams</li>
          <li>JPG / JPEG — photos & scanned notes</li>
          <li>WEBP — modern web images</li>
          <li>Each image becomes one PDF page</li>
        </ul>
      </div>

    </aside>
  )
}
