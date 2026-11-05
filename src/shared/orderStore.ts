import { useSyncExternalStore } from "react"
import { defaultItems, type Translated } from "./menuStore"

// Shared orders for the whole prototype: the customer places orders, the
// staff tablet moves them through the kitchen and the cashier marks a table
// paid. Saved in localStorage so separate tabs stay in sync (UI-only).

export const CUSTOMER_TABLE = "05"
export const TABLE_COUNT = 11

export type OrderStatus = "received" | "cooking" | "ready" | "served"
export const orderStatuses: OrderStatus[] = ["received", "cooking", "ready", "served"]

export type Size = "small" | "normal" | "large"
export type Spice = "none" | "mild" | "medium" | "hot"
/** Quick kitchen notes used by the sample orders (translated on the staff tablet). */
export type PresetNote = "extraSoup" | "noIce"

export type OrderLine = {
  itemId: number
  name: Translated
  isDrink: boolean
  quantity: number
  size: Size
  spice: Spice
  exclusions: string[]
  otherExclusion: string
  note: string
  presetNotes?: PresetNote[]
  lineTotal: number
}

export type Order = {
  id: string
  number: number
  table: string
  placedAt: number
  status: OrderStatus
  lines: OrderLine[]
  total: number
  paid: boolean
  servedAt?: number
}

export type Payment = {
  id: string
  table: string
  paidAt: number
  total: number
}

type OrderState = {
  orders: Order[]
  payments: Payment[]
  nextNumber: number
  /** Last payment the customer phone has already shown "Thank you" for. */
  customerSeenPayment: string | null
  sampleIndex: number
}

export const sizeAdjustment: Record<Size, number> = { small: -10, normal: 0, large: 15 }

// ---------- Sample data ----------

type SampleLine = {
  itemId: number
  quantity: number
  size?: Size
  spice?: Spice
  exclusions?: string[]
  presetNotes?: PresetNote[]
}

const buildLine = (sample: SampleLine): OrderLine => {
  const item = defaultItems.find((entry) => entry.id === sample.itemId)!
  const size = sample.size ?? "normal"
  return {
    itemId: item.id,
    name: item.name,
    isDrink: item.category === "drinks",
    quantity: sample.quantity,
    size,
    spice: sample.spice ?? "none",
    exclusions: sample.exclusions ?? [],
    otherExclusion: "",
    note: "",
    presetNotes: sample.presetNotes,
    lineTotal: (item.price + sizeAdjustment[size]) * sample.quantity,
  }
}

const buildOrder = (
  number: number,
  table: string,
  minutesAgo: number,
  status: OrderStatus,
  lines: SampleLine[],
): Order => {
  const built = lines.map(buildLine)
  const placedAt = Date.now() - minutesAgo * 60_000
  return {
    id: `o-${number}`,
    number,
    table,
    placedAt,
    status,
    lines: built,
    total: built.reduce((sum, line) => sum + line.lineTotal, 0),
    paid: false,
    servedAt: status === "served" ? placedAt + 14 * 60_000 : undefined,
  }
}

// Item ids: 1 Shan Noodle, 2 Mohinga, 3 Fried Rice, 4 Tofu Fritters,
// 5 Tea Leaf Salad, 7 Burmese Milk Tea, 8 Lime Juice.
// Table 05 is the customer's own table, so it starts empty.
const seedOrders = (): Order[] => [
  buildOrder(1030, "03", 16, "received", [
    { itemId: 1, quantity: 2, spice: "mild", exclusions: ["peanuts"] },
    { itemId: 7, quantity: 1 },
  ]),
  buildOrder(1032, "07", 11, "received", [
    { itemId: 2, quantity: 1, presetNotes: ["extraSoup"] },
    { itemId: 5, quantity: 1 },
    { itemId: 8, quantity: 2, presetNotes: ["noIce"] },
  ]),
  buildOrder(1034, "08", 6, "received", [
    { itemId: 3, quantity: 1, size: "large", spice: "mild" },
    { itemId: 4, quantity: 1 },
  ]),
  buildOrder(1035, "11", 2, "received", [
    { itemId: 1, quantity: 3, exclusions: ["peanuts"] },
  ]),
  buildOrder(1029, "02", 13, "cooking", [
    { itemId: 2, quantity: 1, spice: "mild", presetNotes: ["extraSoup"] },
    { itemId: 7, quantity: 1 },
  ]),
  buildOrder(1031, "09", 8, "cooking", [
    { itemId: 3, quantity: 2 },
    { itemId: 8, quantity: 2, presetNotes: ["noIce"] },
  ]),
  buildOrder(1028, "04", 9, "ready", [
    { itemId: 5, quantity: 1, exclusions: ["peanuts"] },
  ]),
  buildOrder(1026, "01", 32, "served", [
    { itemId: 1, quantity: 2 },
    { itemId: 7, quantity: 2 },
  ]),
]

const incomingSamples: { table: string; lines: SampleLine[] }[] = [
  {
    table: "06",
    lines: [
      { itemId: 1, quantity: 1, presetNotes: ["extraSoup"] },
      { itemId: 8, quantity: 1, presetNotes: ["noIce"] },
    ],
  },
  {
    table: "10",
    lines: [
      { itemId: 2, quantity: 2, spice: "mild" },
      { itemId: 4, quantity: 1 },
    ],
  },
  {
    table: "01",
    lines: [
      { itemId: 5, quantity: 1, exclusions: ["peanuts"] },
      { itemId: 3, quantity: 1 },
      { itemId: 7, quantity: 2 },
    ],
  },
  {
    table: "08",
    lines: [{ itemId: 3, quantity: 2, spice: "mild", exclusions: ["peanuts"] }],
  },
]

// ---------- Store ----------

const STORAGE_KEY = "linn-orders-v1"

const defaults = (): OrderState => ({
  orders: seedOrders(),
  payments: [],
  nextNumber: 1036,
  customerSeenPayment: null,
  sampleIndex: 0,
})

const load = (): OrderState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as OrderState
      if (Array.isArray(parsed.orders) && Array.isArray(parsed.payments))
        return parsed
    }
  } catch {
    // Unreadable or blocked storage — start from the sample orders.
  }
  return defaults()
}

let state: OrderState = load()
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())

const save = (next: OrderState) => {
  state = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage full or blocked — changes still apply until the page reloads.
  }
  emit()
}

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) {
    state = load()
    emit()
  }
})

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useOrders = () =>
  useSyncExternalStore(subscribe, () => state, () => state)

/** Unpaid orders for one table, newest first. */
export const openOrdersFor = (orders: Order[], table: string) =>
  orders
    .filter((order) => order.table === table && !order.paid)
    .sort((a, b) => b.placedAt - a.placedAt)

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  received: "cooking",
  cooking: "ready",
  ready: "served",
  served: null,
}

export const orderActions = {
  placeOrder(table: string, lines: OrderLine[]): Order {
    const order: Order = {
      id: `o-${state.nextNumber}-${Date.now().toString(36)}`,
      number: state.nextNumber,
      table,
      placedAt: Date.now(),
      status: "received",
      lines,
      total: lines.reduce((sum, line) => sum + line.lineTotal, 0),
      paid: false,
    }
    save({ ...state, orders: [...state.orders, order], nextNumber: state.nextNumber + 1 })
    return order
  },

  /** Staff "Simulate new order" — never uses the customer's own table. */
  simulateIncoming(): Order {
    const sample = incomingSamples[state.sampleIndex % incomingSamples.length]
    const lines = sample.lines.map(buildLine)
    const order: Order = {
      id: `o-${state.nextNumber}-${Date.now().toString(36)}`,
      number: state.nextNumber,
      table: sample.table,
      placedAt: Date.now(),
      status: "received",
      lines,
      total: lines.reduce((sum, line) => sum + line.lineTotal, 0),
      paid: false,
    }
    save({
      ...state,
      orders: [...state.orders, order],
      nextNumber: state.nextNumber + 1,
      sampleIndex: state.sampleIndex + 1,
    })
    return order
  },

  advance(id: string) {
    save({
      ...state,
      orders: state.orders.map((order) => {
        const next = nextStatus[order.status]
        if (order.id !== id || !next) return order
        return { ...order, status: next, servedAt: next === "served" ? Date.now() : order.servedAt }
      }),
    })
  },

  markTablePaid(table: string): Payment | null {
    const open = openOrdersFor(state.orders, table)
    if (open.length === 0) return null
    const payment: Payment = {
      id: `p-${Date.now().toString(36)}`,
      table,
      paidAt: Date.now(),
      total: open.reduce((sum, order) => sum + order.total, 0),
    }
    save({
      ...state,
      orders: state.orders.map((order) =>
        order.table === table && !order.paid ? { ...order, paid: true } : order,
      ),
      payments: [...state.payments, payment],
    })
    return payment
  },

  /** The customer phone has shown the "Thank you" screen for this payment. */
  acknowledgePayment(id: string) {
    save({ ...state, customerSeenPayment: id })
  },

  reset() {
    save(defaults())
  },
}

/** Latest payment for the customer's table that the phone hasn't shown yet. */
export const unseenCustomerPayment = (current: OrderState) => {
  const latest = [...current.payments]
    .filter((payment) => payment.table === CUSTOMER_TABLE)
    .sort((a, b) => b.paidAt - a.paidAt)[0]
  return latest && latest.id !== current.customerSeenPayment ? latest : null
}
