import { useState } from 'react'
import Header from './components/Header'
import DropZone from './components/DropZone'
import FileList from './components/FileList'
import Sidebar from './components/Sidebar'
import ImageDropZone from './components/ImageDropZone'
import ImageGrid from './components/ImageGrid'
import ImageToPdfSidebar from './components/ImageToPdfSidebar'
import { usePdfMerger } from './hooks/usePdfMerger'
import { useImageToPdf } from './hooks/useImageToPdf'
import styles from './App.module.css'

const TABS = [
  { id: 'merge', label: 'Merge PDFs', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
    </svg>
  )},
  { id: 'images', label: 'Images → PDF', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  )},
]

export default function App() {
  const [activeTab, setActiveTab] = useState('merge')

  const merger = usePdfMerger()
  const converter = useImageToPdf()

  return (
    <div className={styles.app}>
      <Header />

      {/* Tab Bar */}
      <div className={styles.tabBar}>
        <div className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        <div className={styles.tabLine} />
      </div>

      {/* MERGE TAB */}
      {activeTab === 'merge' && (
        <main className={styles.main}>
          <div className={styles.left}>
            <DropZone
              onFiles={merger.addFiles}
              onImages={merger.addImages}
              acceptImages={true}
            />
            <FileList
              files={merger.files}
              onRemove={merger.removeFile}
              onReorder={merger.reorderFiles}
            />
            {merger.files.length === 0 && (
              <div className={styles.emptyHint}>
                Add PDFs and/or images. They'll be merged in order — images become individual pages.
              </div>
            )}
          </div>
          <Sidebar
            files={merger.files}
            totalSize={merger.totalSize}
            totalPages={merger.totalPages}
            status={merger.status}
            progress={merger.progress}
            errorMsg={merger.errorMsg}
            onMerge={merger.merge}
            onClear={merger.clearAll}
          />
        </main>
      )}

      {/* IMAGES → PDF TAB */}
      {activeTab === 'images' && (
        <main className={styles.main}>
          <div className={styles.left}>
            <ImageDropZone onImages={converter.addImages} />
            <ImageGrid
              images={converter.images}
              onRemove={converter.removeImage}
              onReorder={converter.reorderImages}
            />
            {converter.images.length === 0 && (
              <div className={styles.emptyHint}>
                Add images above. Each image becomes one page in the output PDF. Drag to reorder.
              </div>
            )}
          </div>
          <ImageToPdfSidebar
            images={converter.images}
            totalSize={converter.totalSize}
            status={converter.status}
            progress={converter.progress}
            errorMsg={converter.errorMsg}
            onConvert={converter.convert}
            onClear={converter.clearAll}
          />
        </main>
      )}

      <footer className={styles.footer}>
        <span>Study Stack PDF Merger</span>
        <span>No files leave your device · Built with pdf-lib</span>
      </footer>
    </div>
  )
}
