import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoMark}>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </div>
      <div className={styles.text}>
        <h1 className={styles.title}>Study Stack</h1>
        <p className={styles.sub}>PDF Merger — Exam Prep Tool</p>
      </div>
      <div className={styles.badge}>
        <span className={styles.dot} />
        Client-side only
      </div>
    </header>
  )
}
