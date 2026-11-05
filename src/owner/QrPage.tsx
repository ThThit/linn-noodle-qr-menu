import { useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import "./qr.css"
import { BowlMark } from "./Logo"
import { QrCode, downloadQrPng } from "./QrCode"
import { ownerCopy, type Language } from "./ownerCopy"
import { qrCopy, scanToOrder, scanToViewMenu, tableWords } from "./qrCopy"

export type QrTable = { table: string; token: string }

const MIN_TABLES = 1
const MAX_TABLES = 60
const DEFAULT_TABLES = 11

const newToken = () => Math.random().toString(36).slice(2, 8).toUpperCase()
const pad = (n: number) => String(n).padStart(2, "0")

/** The link a customer's phone opens. Each table gets its own code. */
const qrUrl = (entry: QrTable) =>
  `${window.location.origin}/?table=${entry.table}&code=${entry.token}`

const icon = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)
const downloadIcon = icon(<><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" /><path d="M5 19h14" /></>)
const printIcon = icon(<><path d="M7 9V4h10v5" /><rect x="4" y="9" width="16" height="7" rx="2" /><path d="M7 14h10v6H7z" /></>)
const refreshIcon = icon(<><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" /><path d="M19.5 4.5v4h-4" /></>)

const words = (line: string) =>
  line.split(" ").map((word, index) => (
    <span key={index}>
      {index > 0 && " "}
      <span className="word">{word}</span>
    </span>
  ))

function ScanLines({ text }: { text: typeof scanToOrder }) {
  return (
    <ul className="scan-lines">
      <li lang="my">{words(text.my)}</li>
      <li lang="en">{words(text.en)}</li>
      <li lang="zh-Hans">{words(text.zh)}</li>
    </ul>
  )
}

function TentHalf({ entry, flipped }: { entry: QrTable; flipped?: boolean }) {
  return (
    <div className={flipped ? "tent-half flipped" : "tent-half"}>
      <QrCode
        className="tent-qr"
        value={qrUrl(entry)}
        label={`QR code, table ${entry.table}`}
      />
      <div className="tent-info">
        <div className="tent-brand">
          <BowlMark />
          <span>Linn Noodle</span>
        </div>
        <p className="tent-table-words">
          <span lang="my">{tableWords.my}</span> · {tableWords.en} ·{" "}
          <span lang="zh-Hans">{tableWords.zh}</span>
        </p>
        <p className="tent-table-number">{entry.table}</p>
        <ScanLines text={scanToViewMenu} />
      </div>
    </div>
  )
}

/** A4 page: the top half is upside down so both sides read correctly once folded. */
function TentCard({ entry, foldLabel }: { entry: QrTable; foldLabel: string }) {
  return (
    <div className="tent-page">
      <TentHalf entry={entry} flipped />
      <div className="tent-fold">
        <span>{foldLabel}</span>
      </div>
      <TentHalf entry={entry} />
    </div>
  )
}

function PrintPreview({
  entries,
  language,
  showPdfHint,
  onClose,
}: {
  entries: QrTable[]
  language: Language
  showPdfHint: boolean
  onClose: () => void
}) {
  const q = qrCopy[language]
  const printButton = useRef<HTMLButtonElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    printButton.current?.focus()
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && closeRef.current()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <div
        className="modal-overlay"
        role="presentation"
        onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      >
        <section
          className="print-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="print-title"
        >
          <header className="print-modal-head">
            <div>
              <h2 id="print-title">{q.previewTitle}</h2>
              <p>{q.previewSub(entries.length)}</p>
            </div>
            <button
              type="button"
              className="modal-close"
              aria-label={q.close}
              onClick={onClose}
            >
              ×
            </button>
          </header>

          {showPdfHint && <p className="pdf-hint">💡 {q.pdfHint}</p>}

          <div
            className={
              entries.length === 1 ? "print-modal-body single" : "print-modal-body"
            }
          >
            {entries.map((entry) => (
              <div className="tent-preview" key={entry.table}>
                <TentCard entry={entry} foldLabel={q.foldHere} />
              </div>
            ))}
          </div>

          <footer className="print-modal-foot">
            <button type="button" className="secondary-button" onClick={onClose}>
              {q.cancel}
            </button>
            <button
              type="button"
              ref={printButton}
              className="primary-button print-confirm"
              onClick={() => window.print()}
            >
              {printIcon}
              <span>{q.print}</span>
            </button>
          </footer>
        </section>
      </div>

      {/* Only this sheet is visible on paper (see @media print in owner.css). */}
      {createPortal(
        <div className="print-sheet" lang={language === "zh" ? "zh-Hans" : language}>
          {entries.map((entry) => (
            <TentCard key={entry.table} entry={entry} foldLabel={q.foldHere} />
          ))}
        </div>,
        document.body,
      )}
    </>
  )
}

export default function QrPage({
  language,
  tables,
  setTables,
}: {
  language: Language
  tables: QrTable[] | null
  setTables: (tables: QrTable[]) => void
}) {
  const t = ownerCopy[language]
  const q = qrCopy[language]
  const [count, setCount] = useState(tables?.length ?? DEFAULT_TABLES)
  const [preview, setPreview] = useState<{ entries: QrTable[]; pdf: boolean } | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const showToast = (message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }

  const flashCard = (table: string) => {
    setFlash(table)
    window.setTimeout(() => setFlash((current) => (current === table ? null : current)), 1400)
  }

  const generate = () => {
    // Keep existing codes so tents already on tables keep working.
    const existing = new Map((tables ?? []).map((entry) => [entry.table, entry.token]))
    const next = Array.from({ length: count }, (_, index) => {
      const table = pad(index + 1)
      return { table, token: existing.get(table) ?? newToken() }
    })
    setTables(next)
    showToast(q.codesReady(next.length))
  }

  const regenerate = (table: string) => {
    if (!tables) return
    setTables(
      tables.map((entry) =>
        entry.table === table ? { ...entry, token: newToken() } : entry,
      ),
    )
    flashCard(table)
    showToast(q.regenerated(table))
  }

  const download = (entry: QrTable) => {
    downloadQrPng(
      qrUrl(entry),
      `Table ${entry.table}`,
      `linn-noodle-table-${entry.table}.png`,
    )
    showToast(q.downloaded(entry.table))
  }

  const clamp = (value: number) => Math.min(MAX_TABLES, Math.max(MIN_TABLES, value))

  return (
    <div className="qr-page">
      <header className="qr-header">
        <div className="page-heading">
          <h1>{q.title}</h1>
          <p>{q.helper}</p>
        </div>
        <div className="qr-header-actions">
          <button
            type="button"
            className="secondary-button"
            disabled={!tables}
            onClick={() => tables && setPreview({ entries: tables, pdf: true })}
          >
            {downloadIcon}
            <span>{q.downloadAll}</span>
          </button>
          <button
            type="button"
            className="secondary-button dark"
            disabled={!tables}
            onClick={() => tables && setPreview({ entries: tables, pdf: false })}
          >
            {printIcon}
            <span>{q.printAll}</span>
          </button>
        </div>
      </header>

      <section className="panel generate-panel">
        <div className="generate-count">
          <p className="generate-label">{q.numberOfTables}</p>
          <div className="big-stepper">
            <button
              type="button"
              aria-label={q.fewer}
              disabled={count <= MIN_TABLES}
              onClick={() => setCount((value) => clamp(value - 1))}
            >
              −
            </button>
            <input
              inputMode="numeric"
              aria-label={q.numberOfTables}
              value={count}
              onChange={(event) => {
                const value = Number(event.target.value.replace(/\D/g, ""))
                if (!Number.isNaN(value)) setCount(clamp(value || MIN_TABLES))
              }}
            />
            <button
              type="button"
              aria-label={q.more}
              disabled={count >= MAX_TABLES}
              onClick={() => setCount((value) => clamp(value + 1))}
            >
              +
            </button>
          </div>
        </div>
        <div className="generate-action">
          <button type="button" className="primary-button generate-button" onClick={generate}>
            {q.generate}
          </button>
          <p>{q.generateHint}</p>
        </div>
      </section>

      {!tables ? (
        <section className="qr-empty">
          <div className="qr-empty-icon" aria-hidden="true">
            {icon(<><rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1" /><rect x="14" y="3.5" width="6.5" height="6.5" rx="1" /><rect x="3.5" y="14" width="6.5" height="6.5" rx="1" /><path d="M14 14h2.5v2.5H14zM18 18h2.5v2.5H18zM14 20.5h2M20.5 14v2" /></>)}
          </div>
          <h2>{q.emptyTitle}</h2>
          <p>{q.emptyText}</p>
        </section>
      ) : (
        <section className="qr-grid">
          {tables.map((entry) => (
            <article
              key={entry.table}
              className={flash === entry.table ? "qr-card flash" : "qr-card"}
            >
              <QrCode
                className="qr-card-code"
                value={qrUrl(entry)}
                label={`QR code, ${t.tableNumber(entry.table)}`}
              />
              <p className="qr-card-table">{t.tableNumber(entry.table)}</p>
              <ScanLines text={scanToOrder} />
              <div className="qr-card-actions">
                <button type="button" onClick={() => download(entry)}>
                  {downloadIcon}
                  <span>{q.download}</span>
                </button>
                <button
                  type="button"
                  className="print"
                  onClick={() => setPreview({ entries: [entry], pdf: false })}
                >
                  {printIcon}
                  <span>{q.print}</span>
                </button>
                <button type="button" onClick={() => regenerate(entry.table)}>
                  {refreshIcon}
                  <span>{q.regenerate}</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {preview && (
        <PrintPreview
          entries={preview.entries}
          language={language}
          showPdfHint={preview.pdf}
          onClose={() => setPreview(null)}
        />
      )}

      {toast && (
        <div className="owner-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  )
}
