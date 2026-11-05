import type { DishKey } from "../staff/staffData"

// Sample data for the owner dashboard (UI only — no backend).

export type Trend = { direction: "up" | "down"; percent: number }

export type SummaryId = "revenue" | "orders" | "average" | "tables"

export type SummaryCard = {
  id: SummaryId
  value: string
  trend: Trend
}

export const summaryCards: SummaryCard[] = [
  { id: "revenue", value: "฿8,450", trend: { direction: "up", percent: 12 } },
  { id: "orders", value: "62", trend: { direction: "up", percent: 8 } },
  { id: "average", value: "฿136", trend: { direction: "down", percent: 5 } },
  { id: "tables", value: "7 / 11", trend: { direction: "up", percent: 17 } },
]

export type DayRevenue = { date: Date; value: number }

const DAY = 24 * 60 * 60 * 1000

const startOfToday = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

// Oldest → newest; the last value is today (matches the ฿8,450 card).
const last30Days = [
  6120, 7340, 9480, 9910, 5870, 6250, 6630, 6890, 8120, 9760, 10120, 6010,
  6340, 6780, 7010, 8540, 9980, 10380, 6200, 6560, 6950, 7120, 8360, 6980,
  8920, 10450, 9870, 6420, 7545, 8450,
]

export const monthRevenue = (): DayRevenue[] => {
  const today = startOfToday().getTime()
  return last30Days.map((value, index) => ({
    date: new Date(today - (last30Days.length - 1 - index) * DAY),
    value,
  }))
}

export const weekRevenue = (): DayRevenue[] => monthRevenue().slice(-7)

export type BestSeller = {
  dish: DishKey
  image: string
  sold: number
  revenue: number
}

export const bestSellers: BestSeller[] = [
  {
    dish: "shanNoodle",
    image:
      "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?auto=format&fit=crop&w=160&q=80",
    sold: 412,
    revenue: 24720,
  },
  {
    dish: "milkTea",
    image:
      "https://images.unsplash.com/photo-1682139710677-cb02f6bc4211?auto=format&fit=crop&w=160&q=80",
    sold: 365,
    revenue: 14600,
  },
  {
    dish: "mohinga",
    image:
      "https://images.unsplash.com/photo-1730622424540-f4af08184fb6?auto=format&fit=crop&w=160&q=80",
    sold: 338,
    revenue: 23660,
  },
  {
    dish: "teaLeafSalad",
    image:
      "https://images.unsplash.com/photo-1565724213491-9f1ed5ae561f?auto=format&fit=crop&w=160&q=80",
    sold: 241,
    revenue: 16870,
  },
  {
    dish: "friedRice",
    image:
      "https://images.unsplash.com/photo-1677366827953-315db98495e6?auto=format&fit=crop&w=160&q=80",
    sold: 198,
    revenue: 15840,
  },
]

export type OrderStatus = "new" | "cooking" | "ready" | "served"

export type OwnerOrder = {
  orderNumber: string
  table: string
  time: string
  items: { quantity: number; dish: DishKey }[]
  total: number
  status: OrderStatus
  /** 0 = today, 1 = yesterday */
  daysAgo: number
}

export const orders: OwnerOrder[] = [
  { orderNumber: "#LN-110", table: "06", time: "13:42", items: [{ quantity: 1, dish: "shanNoodle" }, { quantity: 1, dish: "limeJuice" }], total: 105, status: "new", daysAgo: 0 },
  { orderNumber: "#LN-109", table: "11", time: "13:38", items: [{ quantity: 3, dish: "shanNoodle" }], total: 180, status: "new", daysAgo: 0 },
  { orderNumber: "#LN-108", table: "02", time: "13:31", items: [{ quantity: 1, dish: "mohinga" }, { quantity: 1, dish: "milkTea" }], total: 110, status: "cooking", daysAgo: 0 },
  { orderNumber: "#LN-107", table: "09", time: "13:25", items: [{ quantity: 2, dish: "friedRice" }, { quantity: 2, dish: "limeJuice" }], total: 250, status: "cooking", daysAgo: 0 },
  { orderNumber: "#LN-106", table: "04", time: "13:12", items: [{ quantity: 1, dish: "teaLeafSalad" }], total: 70, status: "ready", daysAgo: 0 },
  { orderNumber: "#LN-105", table: "05", time: "12:58", items: [{ quantity: 1, dish: "friedRice" }, { quantity: 1, dish: "tofuFritters" }], total: 130, status: "served", daysAgo: 0 },
  { orderNumber: "#LN-104", table: "07", time: "12:47", items: [{ quantity: 1, dish: "mohinga" }, { quantity: 1, dish: "teaLeafSalad" }, { quantity: 2, dish: "limeJuice" }], total: 230, status: "served", daysAgo: 0 },
  { orderNumber: "#LN-103", table: "03", time: "12:30", items: [{ quantity: 2, dish: "shanNoodle" }, { quantity: 1, dish: "milkTea" }], total: 160, status: "served", daysAgo: 0 },
  { orderNumber: "#LN-102", table: "10", time: "12:14", items: [{ quantity: 2, dish: "friedRice" }], total: 160, status: "served", daysAgo: 0 },
  { orderNumber: "#LN-101", table: "01", time: "11:52", items: [{ quantity: 1, dish: "shanNoodle" }, { quantity: 1, dish: "tofuFritters" }], total: 110, status: "served", daysAgo: 0 },
  { orderNumber: "#LN-100", table: "08", time: "11:20", items: [{ quantity: 2, dish: "mohinga" }, { quantity: 1, dish: "milkTea" }], total: 180, status: "served", daysAgo: 0 },
  { orderNumber: "#LN-099", table: "12", time: "10:46", items: [{ quantity: 1, dish: "milkTea" }, { quantity: 1, dish: "tofuFritters" }], total: 90, status: "served", daysAgo: 0 },
  { orderNumber: "#LN-061", table: "05", time: "20:34", items: [{ quantity: 1, dish: "friedRice" }, { quantity: 1, dish: "limeJuice" }], total: 125, status: "served", daysAgo: 1 },
  { orderNumber: "#LN-060", table: "02", time: "19:58", items: [{ quantity: 2, dish: "mohinga" }], total: 140, status: "served", daysAgo: 1 },
  { orderNumber: "#LN-059", table: "07", time: "19:12", items: [{ quantity: 1, dish: "teaLeafSalad" }, { quantity: 2, dish: "milkTea" }], total: 150, status: "served", daysAgo: 1 },
  { orderNumber: "#LN-058", table: "11", time: "18:40", items: [{ quantity: 3, dish: "shanNoodle" }, { quantity: 1, dish: "limeJuice" }], total: 225, status: "served", daysAgo: 1 },
  { orderNumber: "#LN-057", table: "03", time: "12:22", items: [{ quantity: 1, dish: "shanNoodle" }], total: 60, status: "served", daysAgo: 1 },
]

// Orders per hour today, 10 AM – 9 PM (sums to 62).
export const busyHours = [
  { hour: 10, orders: 2 },
  { hour: 11, orders: 5 },
  { hour: 12, orders: 11 },
  { hour: 13, orders: 9 },
  { hour: 14, orders: 4 },
  { hour: 15, orders: 3 },
  { hour: 16, orders: 3 },
  { hour: 17, orders: 5 },
  { hour: 18, orders: 8 },
  { hour: 19, orders: 7 },
  { hour: 20, orders: 4 },
  { hour: 21, orders: 1 },
]
