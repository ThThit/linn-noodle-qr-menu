import { useMemo, useState } from "react"
import BarChart, { type Bar } from "./BarChart"
import {
  bestSellers,
  busyHours,
  monthRevenue,
  orders,
  summaryCards,
  weekRevenue,
  type OwnerOrder,
} from "./ownerData"
import { dishNames, formatDate, ownerCopy, type Language } from "./ownerCopy"

type Range = "week" | "month"

const baht = (value: number) => `฿${value.toLocaleString("en-US")}`
const shortBaht = (value: number) =>
  value >= 1000 ? `฿${(value / 1000).toLocaleString("en-US")}k` : `฿${value}`

const toInputDate = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

const itemsText = (order: OwnerOrder, language: Language) =>
  order.items
    .map(
      (item) =>
        `${item.quantity > 1 ? `${item.quantity} × ` : ""}${dishNames[item.dish][language]}`,
    )
    .join(ownerCopy[language].itemSeparator)

function SummaryCards({ language }: { language: Language }) {
  const t = ownerCopy[language]
  return (
    <section className="summary-grid">
      {summaryCards.map((card) => (
        <article className="summary-card" key={card.id}>
          <p className="summary-label">{t.summary[card.id].label}</p>
          <p className="summary-value">{card.value}</p>
          <p className={`trend trend-${card.trend.direction}`}>
            <span aria-hidden="true">
              {card.trend.direction === "up" ? "▲" : "▼"}
            </span>
            {t.trend(card.trend.direction, card.trend.percent)}
          </p>
          <p className="summary-helper">{t.summary[card.id].helper}</p>
        </article>
      ))}
    </section>
  )
}

function RevenueChart({ language }: { language: Language }) {
  const t = ownerCopy[language]
  const weekday = (date: Date) => formatDate(date, language, "weekday")
  const dayMonth = (date: Date) => formatDate(date, language, "dayMonth")

  const [range, setRange] = useState<Range>("week")
  const days = range === "week" ? weekRevenue() : monthRevenue()
  const total = days.reduce((sum, day) => sum + day.value, 0)
  const best = days.reduce((a, b) => (b.value > a.value ? b : a))
  const lastIndex = days.length - 1

  const bars: Bar[] = days.map((day, index) => {
    const isToday = index === lastIndex
    const label = isToday
      ? t.today
      : range === "week"
        ? weekday(day.date)
        : (lastIndex - index) % 5 === 0
          ? dayMonth(day.date)
          : ""
    return {
      key: day.date.toISOString(),
      label,
      value: day.value,
      highlight: isToday,
      tooltip: `${isToday ? t.today : weekday(day.date)}, ${dayMonth(day.date)}: ${baht(day.value)}`,
    }
  })

  return (
    <section className="panel revenue-panel">
      <header className="panel-head">
        <div>
          <h2>{t.moneyEarned}</h2>
          <p className="panel-sub">
            {dayMonth(days[0].date)} – {dayMonth(days[lastIndex].date)}
          </p>
        </div>
        <div className="segmented" role="group" aria-label={t.moneyEarned}>
          {(["week", "month"] as const).map((option) => (
            <button
              type="button"
              key={option}
              className={range === option ? "active" : ""}
              aria-pressed={range === option}
              onClick={() => setRange(option)}
            >
              {option === "week" ? t.thisWeek : t.thisMonth}
            </button>
          ))}
        </div>
      </header>

      <div className="revenue-stats">
        <div>
          <span>{range === "week" ? t.totalWeek : t.totalMonth}</span>
          <strong>{baht(total)}</strong>
        </div>
        <div>
          <span>
            {t.bestDay} · {weekday(best.date)} {dayMonth(best.date)}
          </span>
          <strong>{baht(best.value)}</strong>
        </div>
        <div>
          <span>{t.averagePerDay}</span>
          <strong>{baht(Math.round(total / days.length))}</strong>
        </div>
      </div>

      <BarChart
        bars={bars}
        formatAxis={shortBaht}
        formatValue={baht}
        height={250}
        ariaLabel={`${t.moneyEarned}, ${range === "week" ? t.thisWeek : t.thisMonth}: ${baht(total)}`}
      />
      <p className="chart-hint">{t.chartHint}</p>
    </section>
  )
}

function BestSellers({ language }: { language: Language }) {
  const t = ownerCopy[language]
  const top = bestSellers[0].sold
  return (
    <section className="panel best-panel">
      <header className="panel-head">
        <div>
          <h2>{t.bestSelling}</h2>
          <p className="panel-sub">{t.thisMonthSub}</p>
        </div>
      </header>
      <ol className="best-list">
        {bestSellers.map((item, index) => {
          const name = dishNames[item.dish][language]
          return (
            <li key={item.dish}>
              <span className={`rank rank-${index + 1}`}>{index + 1}</span>
              <img src={item.image} alt="" />
              <div className="best-body">
                <div className="best-row">
                  <p className="best-name">{name}</p>
                  <p className="best-revenue">{baht(item.revenue)}</p>
                </div>
                <div className="best-row">
                  <div
                    className="popularity"
                    role="meter"
                    aria-label={name}
                    aria-valuemin={0}
                    aria-valuemax={top}
                    aria-valuenow={item.sold}
                  >
                    <span style={{ width: `${(item.sold / top) * 100}%` }} />
                  </div>
                  <p className="best-sold">{t.sold(item.sold)}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function OrdersTable({ language }: { language: Language }) {
  const t = ownerCopy[language]
  const todayValue = toInputDate(new Date())
  const [query, setQuery] = useState("")
  const [date, setDate] = useState(todayValue)

  const daysAgo = useMemo(() => {
    const [y, m, d] = date.split("-").map(Number)
    const picked = new Date(y, m - 1, d).getTime()
    const now = new Date()
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime()
    return Math.round((today - picked) / 86_400_000)
  }, [date])

  const rows = orders.filter((order) => {
    if (order.daysAgo !== daysAgo) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    // Match the current language and English, so either spelling works.
    return [
      order.orderNumber,
      order.table,
      t.tableNumber(order.table),
      itemsText(order, language),
      itemsText(order, "en"),
    ]
      .join(" ")
      .toLowerCase()
      .includes(q)
  })

  const title =
    daysAgo === 0
      ? t.todaysOrders
      : t.ordersOn(
          formatDate(new Date(date + "T00:00"), language, "weekdayLong"),
        )

  return (
    <section className="panel orders-panel">
      <header className="panel-head">
        <div>
          <h2>{title}</h2>
          <p className="panel-sub">
            {daysAgo === 0 ? `${t.latestOrders} · ` : ""}
            {t.ordersShown(rows.length)}
          </p>
        </div>
        <div className="table-tools">
          <label className="search-box">
            <svg viewBox="0 0 20 20" aria-hidden="true" fill="none">
              <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="2" />
              <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="sr-only">{t.searchPlaceholder}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.searchPlaceholder}
            />
          </label>
          <label className="date-box">
            <span className="sr-only">{t.chooseDate}</span>
            <input
              type="date"
              value={date}
              max={todayValue}
              onChange={(event) => setDate(event.target.value || todayValue)}
            />
          </label>
          {daysAgo !== 0 && (
            <button
              type="button"
              className="ghost-button"
              onClick={() => setDate(todayValue)}
            >
              {t.backToToday}
            </button>
          )}
        </div>
      </header>

      {rows.length === 0 ? (
        <div className="table-empty">
          <p>{t.noOrders}</p>
          <span>{query ? t.tryDifferent : t.noOrdersDay}</span>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>{t.columns.order}</th>
                <th>{t.columns.table}</th>
                <th>{t.columns.time}</th>
                <th>{t.columns.items}</th>
                <th className="num">{t.columns.total}</th>
                <th>{t.columns.status}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order.orderNumber}>
                  <td className="strong">{order.orderNumber}</td>
                  <td>{t.tableNumber(order.table)}</td>
                  <td>{order.time}</td>
                  <td className="items-cell">{itemsText(order, language)}</td>
                  <td className="num strong">{baht(order.total)}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      <i aria-hidden="true" />
                      {t.status[order.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function BusyHours({ language }: { language: Language }) {
  const t = ownerCopy[language]
  const busiest = busyHours.reduce((a, b) => (b.orders > a.orders ? b : a))
  const range = (hour: number) => `${t.hour(hour)} – ${t.hour(hour + 1)}`
  const bars: Bar[] = busyHours.map((slot) => ({
    key: String(slot.hour),
    label: t.hour(slot.hour),
    value: slot.orders,
    highlight: slot.hour === busiest.hour,
    tooltip: `${range(slot.hour)}: ${t.ordersCount(slot.orders)}`,
  }))

  return (
    <section className="panel busy-panel">
      <header className="panel-head">
        <div>
          <h2>{t.busyHours}</h2>
          <p className="panel-sub">{t.busySub}</p>
        </div>
      </header>
      <p className="busy-callout">
        {t.busiestTime} <strong>{range(busiest.hour)}</strong> ·{" "}
        <strong>{t.ordersCount(busiest.orders)}</strong>
      </p>
      <BarChart
        bars={bars}
        formatAxis={(value) => String(value)}
        formatValue={(value) => `${value}`}
        height={210}
        ariaLabel={`${t.busyHours}: ${t.busiestTime} ${range(busiest.hour)}, ${t.ordersCount(busiest.orders)}`}
      />
    </section>
  )
}

export default function Dashboard({ language }: { language: Language }) {
  const t = ownerCopy[language]
  const hour = new Date().getHours()
  const greeting =
    hour < 12
      ? t.greeting.morning
      : hour < 17
        ? t.greeting.afternoon
        : t.greeting.evening

  return (
    <div className="dashboard">
      <div className="page-heading">
        <h1>{greeting} 👋</h1>
        <p>{t.intro}</p>
      </div>
      <SummaryCards language={language} />
      <div className="dashboard-row">
        <RevenueChart language={language} />
        <BestSellers language={language} />
      </div>
      <OrdersTable language={language} />
      <BusyHours language={language} />
    </div>
  )
}
