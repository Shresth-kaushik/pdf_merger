import { useState } from 'react'
import styles from './Sidebar.module.css'

function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(2)} MB`
}

export default function Sidebar({ files, totalSize, totalPages, status, progress, errorMsg, onMerge, onClear }) {
  const [outputName, setOutputName] = useState('merged-notes')

  const isEmpty = files.length === 0
  const isMerging = status === 'merging'
  const isDone = status === 'done'
  const isError = status === 'error'

  const statusLabel = {
    idle: isEmpty ? 'Waiting' : 'Ready',
    merging: 'Merging…',
    done: 'Complete ✓',
    error: 'Error',
  }[status]

  const statusClass = {
    idle: isEmpty ? styles.statusWaiting : styles.statusReady,
    merging: styles.statusMerging,
    done: styles.statusDone,
    error: styles.statusError,
  }[status]

  return (
    <aside className={styles.sidebar}>

      {/* Summary */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>Summary</div>
        <div className={styles.stats}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Files added</span>
            <span className={styles.statVal}>{files.length}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Total pages</span>
            <span className={styles.statVal}>{totalPages || '—'}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Total size</span>
            <span className={styles.statVal}>{formatSize(totalSize)}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Status</span>
            <span className={`${styles.statVal} ${statusClass}`}>{statusLabel}</span>
          </div>
        </div>
      </div>

      {/* Filename */}
      <div className={styles.inputGroup}>
        <label htmlFor="output-name" className={styles.inputLabel}>Output filename</label>
        <div className={styles.inputWrapper}>
          <input
            id="output-name"
            type="text"
            value={outputName}
            onChange={e => setOutputName(e.target.value)}
            placeholder="merged-notes"
            className={styles.input}
            disabled={isMerging}
          />
          <span className={styles.ext}>.pdf</span>
        </div>
      </div>

      {/* Progress */}
      {isMerging && (
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.progressLabel}>{progress}%</span>
        </div>
      )}

      {/* Success */}
      {isDone && (
        <div className={styles.successBanner}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Merged PDF downloaded successfully!</span>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className={styles.errorBanner}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMsg || 'Something went wrong.'}</span>
        </div>
      )}

      {/* Merge Button */}
      <button
        className={`${styles.mergeBtn} ${isMerging ? styles.mergingState : ''}`}
        disabled={isEmpty || isMerging}
        onClick={() => onMerge(outputName)}
      >
        {isMerging ? (
          <>
            <span className={styles.spinner} />
            Merging…
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
            Merge &amp; Download
          </>
        )}
      </button>

      {/* Clear */}
      {!isEmpty && (
        <button className={styles.clearBtn} onClick={onClear} disabled={isMerging}>
          Clear all files
        </button>
      )}

      {/* Tips */}
      <div className={styles.tips}>
        <h4 className={styles.tipsTitle}>How it works</h4>
        <ul className={styles.tipsList}>
          <li>Add PDFs in the order you want them merged</li>
          <li>Drag rows to reorder before merging</li>
          <li>All processing is done in your browser</li>
          <li>No files are uploaded to any server</li>
        </ul>
      </div>

    </aside>
  )
}
