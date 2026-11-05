import qrcode from "qrcode-generator"

/** Square grid of dark/light modules for `value` (error correction M). */
function qrMatrix(value: string) {
  const qr = qrcode(0, "M")
  qr.addData(value)
  qr.make()
  const count = qr.getModuleCount()
  const rows: boolean[][] = []
  for (let r = 0; r < count; r++) {
    const row: boolean[] = []
    for (let c = 0; c < count; c++) row.push(qr.isDark(r, c))
    rows.push(row)
  }
  return rows
}

const QUIET = 2 // light border, in modules

export function QrCode({
  value,
  className,
  label,
}: {
  value: string
  className?: string
  label: string
}) {
  const matrix = qrMatrix(value)
  const size = matrix.length + QUIET * 2
  let path = ""
  matrix.forEach((row, r) =>
    row.forEach((dark, c) => {
      if (dark) path += `M${c + QUIET} ${r + QUIET}h1v1h-1z`
    }),
  )
  return (
    <svg
      className={className}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      <rect width={size} height={size} fill="#fff" />
      <path d={path} fill="#271b18" />
    </svg>
  )
}

/** Saves a PNG: QR code with the table name underneath. */
export function downloadQrPng(value: string, caption: string, fileName: string) {
  const matrix = qrMatrix(value)
  const modules = matrix.length + 8 // 4-module quiet zone for print
  const scale = Math.max(8, Math.floor(640 / modules))
  const qrSize = modules * scale
  const captionHeight = 110

  const canvas = document.createElement("canvas")
  canvas.width = qrSize
  canvas.height = qrSize + captionHeight
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "#271b18"
  matrix.forEach((row, r) =>
    row.forEach((dark, c) => {
      if (dark) ctx.fillRect((c + 4) * scale, (r + 4) * scale, scale, scale)
    }),
  )
  ctx.font = "800 56px 'Nunito Sans', 'Noto Sans Myanmar', sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(caption, qrSize / 2, qrSize + captionHeight / 2 - 10)

  const link = document.createElement("a")
  link.download = fileName
  link.href = canvas.toDataURL("image/png")
  link.click()
}
