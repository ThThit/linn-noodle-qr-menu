export type Bar = {
  key: string
  /** Axis label under the bar ("" hides it, e.g. on a crowded month view). */
  label: string
  value: number
  /** Text shown in the hover/focus tooltip. */
  tooltip: string
  /** Darker bar + value printed above it (today, busiest hour…). */
  highlight?: boolean
}

/** Rounds an axis maximum up to a friendly number with ~4 gridlines. */
function niceTicks(max: number, count = 4) {
  if (max <= 0) return [0, 1]
  const rough = max / count
  const power = 10 ** Math.floor(Math.log10(rough))
  const step =
    [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= rough) ??
    10 * power
  const top = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let value = 0; value <= top + step / 2; value += step) ticks.push(value)
  return ticks
}

export default function BarChart({
  bars,
  formatAxis,
  formatValue,
  height = 260,
  ariaLabel,
}: {
  bars: Bar[]
  formatAxis: (value: number) => string
  formatValue: (value: number) => string
  height?: number
  ariaLabel: string
}) {
  const ticks = niceTicks(Math.max(...bars.map((bar) => bar.value)))
  const top = ticks[ticks.length - 1]

  return (
    <div className="bar-chart" role="img" aria-label={ariaLabel}>
      <div className="bar-chart-plot" style={{ height }}>
        {ticks.map((tick) => (
          <div
            key={tick}
            className={tick === 0 ? "chart-gridline baseline" : "chart-gridline"}
            style={{ bottom: `${(tick / top) * 100}%` }}
          >
            <span>{formatAxis(tick)}</span>
          </div>
        ))}

        <div
          className="bar-chart-bars"
          style={{ gap: bars.length > 14 ? 3 : 14 }}
        >
          {bars.map((bar) => (
            <div
              key={bar.key}
              className={bar.highlight ? "chart-bar-slot highlight" : "chart-bar-slot"}
              tabIndex={0}
              aria-label={bar.tooltip}
            >
              <div
                className="chart-bar"
                style={{ height: `${(bar.value / top) * 100}%` }}
              >
                {bar.highlight && (
                  <span className="chart-bar-value">
                    {formatValue(bar.value)}
                  </span>
                )}
                <span className="chart-tooltip" role="tooltip">
                  {bar.tooltip}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="bar-chart-labels"
        style={{ gap: bars.length > 14 ? 3 : 14 }}
        aria-hidden="true"
      >
        {bars.map((bar) => (
          <span key={bar.key} className={bar.highlight ? "highlight" : ""}>
            {bar.label}
          </span>
        ))}
      </div>
    </div>
  )
}
