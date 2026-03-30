import { useCallback } from 'react'
import Header from './components/Header'
import DropZone from './components/DropZone'
import FileList from './components/FileList'
import Sidebar from './components/Sidebar'
import { usePdfMerger } from './hooks/usePdfMerger'
import styles from './App.module.css'

export default function App() {
  const {
    files,
    status,
    progress,
    errorMsg,
    totalSize,
    totalPages,
    addFiles,
    removeFile,
    reorderFiles,
    clearAll,
    merge,
  } = usePdfMerger()

  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.main}>
        <div className={styles.left}>
          <DropZone onFiles={addFiles} />
          <FileList
            files={files}
            onRemove={removeFile}
            onReorder={reorderFiles}
          />
          {files.length === 0 && (
            <div className={styles.emptyHint}>
              Add two or more PDFs above to get started. They'll be merged in the order you add them.
            </div>
          )}
        </div>

        <Sidebar
          files={files}
          totalSize={totalSize}
          totalPages={totalPages}
          status={status}
          progress={progress}
          errorMsg={errorMsg}
          onMerge={merge}
          onClear={clearAll}
        />
      </main>

      <footer className={styles.footer}>
        <span>Study Stack PDF Merger</span>
        <span>No files leave your device · Built with pdf-lib</span>
      </footer>
    </div>
  )
}
