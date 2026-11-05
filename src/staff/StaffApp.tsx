import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import "./staff.css"
import "./bills.css"
import { pick } from "../shared/menuStore"
import {
  TABLE_COUNT,
  openOrdersFor,
  orderActions,
  useOrders,
  type Order,
  type OrderLine,
  type OrderStatus,
} from "../shared/orderStore"
import {
  locales,
  noteNames,
  staffCopy,
  type Language,
  type StaffTab,
} from "./staffCopy"

type View = StaffTab | "bills"

const tabs: StaffTab[] = ["new", "cooking", "ready", "done"]

const tabFor: Record<OrderStatus, StaffTab> = {
  received: "new",
  cooking: "cooking",
  ready: "ready",
  served: "done",
}

const WARN_MINUTES = 10
const LATE_MINUTES = 15
const HIGHLIGHT_MS = 4500
const LANGUAGE_KEY = "linn-staff-language"

const pad = (n: number) => String(n).padStart(2, "0")
const tables = Array.from({ length: TABLE_COUNT }, (_, index) => pad(index + 1))

const readSavedLanguage = (): Language => {
  try {
    const saved = window.localStorage.getItem(LANGUAGE_KEY)
    if (saved === "en" || saved === "my" || saved === "zh") return saved
  } catch {
    // Storage unavailable — fall back to English.
  }
  return "en"
}

const formatClock = (time: number) =>
  new Date(time).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })

const elapsedMinutes = (from: number, now: number) =>
  Math.max(0, Math.floor((now - from) / 60_000))

const baht = (value: number) => `฿${value.toLocaleString("en-US")}`

function BowlMark() {
  return (
    <div className="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" className="size-7" fill="none">
        <path
          d="M7 14.5h18c-.7 6.4-4 9.5-9 9.5s-8.3-3.1-9-9.5Z"
          fill="currentColor"
        />
        <path
          d="M10 11.5c.5-2.1 2.2-3.2 4.1-4.2M15 11.5c.5-2.1 2.2-3.2 4.1-4.2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M11 26h10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
      <path
        d="m6 8 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Kitchen-language note line: size, spice, exclusions and free text. */
function lineNotes(line: OrderLine, language: Language) {
  const t = staffCopy[language]
  const parts: string[] = []
  if (line.size !== "normal") parts.push(t.sizeNames[line.size])
  if (!line.isDrink && line.spice !== "none") parts.push(t.spiceNames[line.spice])
  line.exclusions.forEach((key) => parts.push(t.exclusionNames[key] ?? key))
  line.presetNotes?.forEach((key) => parts.push(noteNames[key][language]))
  if (line.otherExclusion) parts.push(`✕ ${line.otherExclusion}`)
  if (line.note) parts.push(`“${line.note}”`)
  return parts.join(t.noteSeparator)
}

function OrderCard({
  order,
  now,
  language,
  fresh,
  onAdvance,
}: {
  order: Order
  now: number
  language: Language
  fresh: boolean
  onAdvance: (order: Order) => void
}) {
  const t = staffCopy[language]
  const minutes = elapsedMinutes(order.placedAt, now)
  const tab = tabFor[order.status]
  const isDone = tab === "done"
  const age = isDone
    ? ""
    : minutes >= LATE_MINUTES
      ? "late"
      : minutes >= WARN_MINUTES
        ? "warn"
        : ""
  const itemCount = order.lines.reduce((sum, line) => sum + line.quantity, 0)
  const sections = [
    { kind: "kitchen" as const, lines: order.lines.filter((line) => !line.isDrink) },
    { kind: "drinks" as const, lines: order.lines.filter((line) => line.isDrink) },
  ]

  return (
    <article
      className={[
        "order-card",
        `stage-${tab}`,
        age,
        fresh ? "just-arrived" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={`${t.table(order.table)}, #${order.number}`}
    >
      <header className="order-card-head">
        <div>
          <p className="order-table">{t.table(order.table)}</p>
          <p className="order-number">
            #{order.number} · {t.items(itemCount)}
          </p>
        </div>
        {fresh && <span className="new-badge">{t.newBadge}</span>}
        {isDone && order.paid && <span className="paid-badge">{t.paidTag}</span>}
      </header>

      <div className="order-time">
        <span>{t.placed(formatClock(order.placedAt))}</span>
        {isDone ? (
          <strong>{t.served(formatClock(order.servedAt ?? now))}</strong>
        ) : (
          <strong className="elapsed">
            {age && <span className="age-dot" aria-hidden="true" />}
            {t.elapsed(minutes)}
          </strong>
        )}
      </div>

      <div className="order-items">
        {sections.map(
          (section) =>
            section.lines.length > 0 && (
              <section
                key={section.kind}
                className={`station station-${section.kind}`}
              >
                <h3 className="station-label">
                  <span aria-hidden="true">
                    {section.kind === "kitchen" ? "🍜" : "🥤"}
                  </span>
                  {section.kind === "kitchen" ? t.kitchen : t.drinkBar}
                  <span className="station-count">
                    {section.lines.reduce((sum, line) => sum + line.quantity, 0)}
                  </span>
                </h3>
                <ul>
                  {section.lines.map((line, index) => {
                    const notes = lineNotes(line, language)
                    return (
                      <li key={index}>
                        <p className="order-item-name">
                          <span className="order-qty">{line.quantity} ×</span>{" "}
                          {pick(line.name, language)}
                        </p>
                        {notes && <p className="order-item-note">{notes}</p>}
                      </li>
                    )
                  })}
                </ul>
              </section>
            ),
        )}
      </div>

      {isDone ? (
        <div className="order-done-tag">{t.completed}</div>
      ) : (
        <button
          type="button"
          className={`stage-button to-${tab === "new" ? "cooking" : tab === "cooking" ? "ready" : "done"}`}
          onClick={() => onAdvance(order)}
        >
          {t.actions[tab as Exclude<StaffTab, "done">]}
        </button>
      )}
    </article>
  )
}

function Modal({
  className,
  labelledBy,
  onClose,
  children,
}: {
  className: string
  labelledBy: string
  onClose: () => void
  children: ReactNode
}) {
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && closeRef.current()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div
      className="staff-modal-overlay"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        {children}
      </section>
    </div>
  )
}

function BillsView({
  orders,
  language,
  onOpen,
}: {
  orders: Order[]
  language: Language
  onOpen: (table: string) => void
}) {
  const t = staffCopy[language]
  return (
    <main className="bills-grid" aria-label={t.billsTab}>
      {tables.map((table) => {
        const open = openOrdersFor(orders, table)
        const total = open.reduce((sum, order) => sum + order.total, 0)
        const waiting = open.filter((order) => order.status !== "served").length
        const unpaid = open.length > 0
        return (
          <button
            type="button"
            key={table}
            className={unpaid ? "table-card unpaid" : "table-card"}
            onClick={() => onOpen(table)}
          >
            <span className="table-card-number">{t.table(table)}</span>
            <span className="table-card-orders">
              {unpaid ? t.ordersCount(open.length) : "—"}
            </span>
            <span className="table-card-total">{unpaid ? baht(total) : "฿0"}</span>
            {waiting > 0 && (
              <span className="table-card-waiting">{t.notServed(waiting)}</span>
            )}
            <span className={unpaid ? "bill-pill unpaid" : "bill-pill"}>
              {unpaid ? t.unpaid : t.free}
            </span>
          </button>
        )
      })}
    </main>
  )
}

export default function StaffApp() {
  const { orders } = useOrders()
  const [view, setView] = useState<View>("new")
  const [language, setLanguage] = useState<Language>(readSavedLanguage)
  const [now, setNow] = useState(() => Date.now())
  const [toast, setToast] = useState<string | null>(null)
  const [fresh, setFresh] = useState<Set<string>>(() => new Set())
  const [billTable, setBillTable] = useState<string | null>(null)
  const [confirmPaid, setConfirmPaid] = useState(false)
  const toastTimer = useRef<number | undefined>(undefined)
  const seen = useRef<Set<string>>(new Set(orders.map((order) => order.id)))
  const t = staffCopy[language]

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const showToast = (message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }

  // Orders that appear after the tablet opened (e.g. from a customer phone)
  // slide in with a highlight.
  useEffect(() => {
    const arrived = orders.filter((order) => !seen.current.has(order.id))
    if (arrived.length === 0) return
    arrived.forEach((order) => seen.current.add(order.id))
    const ids = arrived.map((order) => order.id)
    setFresh((current) => new Set([...current, ...ids]))
    showToast(t.toastNew(arrived[arrived.length - 1].table))
    window.setTimeout(() => {
      setFresh((current) => {
        const next = new Set(current)
        ids.forEach((id) => next.delete(id))
        return next
      })
    }, HIGHLIGHT_MS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders])

  const changeLanguage = (next: Language) => {
    setLanguage(next)
    try {
      window.localStorage.setItem(LANGUAGE_KEY, next)
    } catch {
      // Ignore — the choice just won't be remembered.
    }
  }

  const advanceOrder = (order: Order) => {
    orderActions.advance(order.id)
    const nextTab =
      order.status === "received" ? "cooking" : order.status === "cooking" ? "ready" : "done"
    setFresh((current) => {
      const next = new Set(current)
      next.delete(order.id)
      return next
    })
    showToast(t.toastMoved(order.table, t.tabs[nextTab]))
  }

  const counts = useMemo(() => {
    const result: Record<StaffTab, number> = { new: 0, cooking: 0, ready: 0, done: 0 }
    orders.forEach((order) => (result[tabFor[order.status]] += 1))
    return result
  }, [orders])

  const unpaidTables = tables.filter((table) => openOrdersFor(orders, table).length > 0)
  const pending = counts.new + counts.cooking
  const hasFreshNew = orders.some(
    (order) => order.status === "received" && fresh.has(order.id),
  )

  const queue = useMemo(
    () =>
      view === "bills"
        ? []
        : orders
            .filter((order) => tabFor[order.status] === view)
            .sort((a, b) =>
              view === "done"
                ? (a.servedAt ?? 0) - (b.servedAt ?? 0)
                : a.placedAt - b.placedAt,
            ),
    [orders, view],
  )

  const billOrders = billTable ? openOrdersFor(orders, billTable) : []
  const billTotal = billOrders.reduce((sum, order) => sum + order.total, 0)

  const markPaid = () => {
    if (!billTable) return
    orderActions.markTablePaid(billTable)
    showToast(t.toastPaid(billTable))
    setConfirmPaid(false)
    setBillTable(null)
  }

  return (
    <div
      className="staff-shell"
      lang={language === "my" ? "my" : language === "zh" ? "zh-Hans" : "en"}
    >
      <header className="staff-topbar">
        <div className="brand-wrap">
          <BowlMark />
          <div>
            <p className="staff-title">{t.title}</p>
            <p className="staff-subtitle">{t.subtitle}</p>
          </div>
        </div>

        <div className="staff-topbar-right">
          <button
            type="button"
            className="simulate-button"
            onClick={() => orderActions.simulateIncoming()}
          >
            {t.simulate}
          </button>
          <label className="language-select">
            <span className="sr-only">{t.language}</span>
            <select
              value={language}
              onChange={(event) =>
                changeLanguage(event.target.value as Language)
              }
            >
              <option value="my">မြန်မာ</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
            <ChevronIcon />
          </label>
          <div className="pending-pill" aria-live="polite">
            <strong>{pending}</strong>
            <span>{t.pending}</span>
          </div>
          <div className="staff-clock">
            <strong>{formatClock(now)}</strong>
            <span>
              {new Date(now).toLocaleDateString(locales[language], {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </header>

      <nav className="staff-tabs" aria-label="Order stages">
        {tabs.map((status) => (
          <button
            type="button"
            key={status}
            className={[
              "staff-tab",
              `tab-${status}`,
              view === status ? "active" : "",
              status === "new" && hasFreshNew && view !== "new" ? "pulse" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-pressed={view === status}
            onClick={() => setView(status)}
          >
            <span>{t.tabs[status]}</span>
            <span className="tab-count">{counts[status]}</span>
          </button>
        ))}
        <span className="tabs-divider" aria-hidden="true" />
        <button
          type="button"
          className={view === "bills" ? "staff-tab tab-bills active" : "staff-tab tab-bills"}
          aria-pressed={view === "bills"}
          onClick={() => setView("bills")}
        >
          <span aria-hidden="true">🧾</span>
          <span>{t.billsTab}</span>
          <span className="tab-count">{unpaidTables.length}</span>
        </button>
        <p className="queue-hint">
          {view === "bills"
            ? t.billsHint
            : view === "done"
              ? t.hintDone
              : t.hintQueue}
        </p>
      </nav>

      {view === "bills" ? (
        <BillsView orders={orders} language={language} onOpen={setBillTable} />
      ) : (
        <main className="queue" aria-live="polite">
          {queue.length === 0 ? (
            <div className="queue-empty">
              <p>{t.emptyTitle}</p>
              <span>{view === "new" ? t.emptyNew : t.emptyOther}</span>
            </div>
          ) : (
            queue.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                now={now}
                language={language}
                fresh={fresh.has(order.id)}
                onAdvance={advanceOrder}
              />
            ))
          )}
        </main>
      )}

      <footer className="staff-legend">
        <span>
          <i className="legend-swatch warn" /> {t.waiting(WARN_MINUTES)}
        </span>
        <span>
          <i className="legend-swatch late" /> {t.waiting(LATE_MINUTES)}
        </span>
        <a href="#" className="customer-link">
          {t.customerLink}
        </a>
      </footer>

      {billTable && !confirmPaid && (
        <Modal className="bill-panel" labelledBy="bill-title" onClose={() => setBillTable(null)}>
          <header className="bill-head">
            <div>
              <h2 id="bill-title">{t.billTitle(billTable)}</h2>
              <p>{t.billSub}</p>
            </div>
            <span className={billOrders.length ? "bill-pill unpaid" : "bill-pill"}>
              {billOrders.length ? t.unpaid : t.free}
            </span>
          </header>

          <div className="bill-body">
            {billOrders.length === 0 ? (
              <p className="bill-empty">{t.noUnpaid}</p>
            ) : (
              billOrders.map((order) => (
                <article key={order.id} className="bill-order">
                  <header>
                    <strong>#{order.number}</strong>
                    <span>{formatClock(order.placedAt)}</span>
                    <span className={`bill-status status-${tabFor[order.status]}`}>
                      {t.tabs[tabFor[order.status]]}
                    </span>
                    <strong className="bill-order-total">{baht(order.total)}</strong>
                  </header>
                  <ul>
                    {order.lines.map((line, index) => (
                      <li key={index}>
                        <span>
                          {line.quantity} × {pick(line.name, language)}
                        </span>
                        <span>{baht(line.lineTotal)}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))
            )}
          </div>

          <footer className="bill-foot">
            <div className="bill-total">
              <span>{t.total}</span>
              <strong>{baht(billTotal)}</strong>
            </div>
            <div className="bill-actions">
              <button type="button" className="bill-secondary" onClick={() => setBillTable(null)}>
                {t.close}
              </button>
              <button
                type="button"
                className="bill-paid-button"
                disabled={billOrders.length === 0}
                onClick={() => setConfirmPaid(true)}
              >
                ✓ {t.markPaid}
              </button>
            </div>
          </footer>
        </Modal>
      )}

      {billTable && confirmPaid && (
        <Modal className="confirm-paid" labelledBy="confirm-paid-title" onClose={() => setConfirmPaid(false)}>
          <div className="confirm-paid-icon" aria-hidden="true">
            ฿
          </div>
          <h2 id="confirm-paid-title">{t.confirmPaidTitle(billTable)}</h2>
          <p className="confirm-paid-amount">{baht(billTotal)}</p>
          <p>{t.confirmPaidText(baht(billTotal))}</p>
          <div className="confirm-paid-actions">
            <button type="button" className="bill-secondary" onClick={() => setConfirmPaid(false)}>
              {t.cancel}
            </button>
            <button type="button" className="bill-paid-button" onClick={markPaid} autoFocus>
              {t.confirmPaidYes}
            </button>
          </div>
        </Modal>
      )}

      {toast && (
        <div className="staff-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  )
}
