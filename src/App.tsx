import { useEffect, useMemo, useState } from "react"
import { pick, useMenu, type Language, type MenuItem } from "./shared/menuStore"
import {
  CUSTOMER_TABLE,
  openOrdersFor,
  orderActions,
  orderStatuses,
  unseenCustomerPayment,
  useOrders,
  type Order,
  type OrderLine,
  type OrderStatus,
  type Size,
  type Spice,
} from "./shared/orderStore"

type Screen = "menu" | "cart" | "confirmation" | "orders"

type CartItem = {
  cartId: number
  itemId: number
  size: Size
  spice: Spice
  exclusions: string[]
  otherExclusion: string
  note: string
  quantity: number
}

type ItemDraft = Omit<CartItem, "cartId"> & { cartId?: number }

const copy = {
  en: {
    table: "Table 05",
    greeting: "What would you like?",
    subtitle: "Freshly made, just for you",
    add: "Add",
    soldOut: "Sold out",
    soldOutInCart:
      "Some items just sold out. Please remove them to place your order.",
    cart: "Cart",
    menu: "Menu",
    close: "Close",
    size: "Size",
    required: "Required",
    spice: "Spice level",
    dontInclude: "Don't include",
    cooked: "How would you like it cooked?",
    notePlaceholder: "e.g., extra soup, noodles soft, sauce separate",
    other: "Other...",
    quantity: "Quantity",
    addToCart: "Add to Cart",
    updateCart: "Update Item",
    yourCart: "Your cart",
    cartSubtitle: "Check your choices before ordering",
    emptyCart: "Your cart is empty",
    emptySubtitle: "Add something delicious from the menu.",
    browseMenu: "Browse Menu",
    edit: "Edit",
    remove: "Remove",
    no: "No",
    total: "Total",
    placeOrder: "Place Order",
    sent: "Your order has been sent to the kitchen!",
    orderNumber: "Order number",
    orderMore: "Order More",
    status: "Order status",
    received: "Received",
    cooking: "Cooking",
    ready: "Ready",
    served: "Served",
    myOrders: "My Orders",
    myOrdersSub: "Everything ordered at this table since the last payment.",
    subtotal: "Subtotal",
    totalToPay: "Total to Pay",
    unpaid: "Unpaid",
    payHelper: "Please pay at the cashier when you are done.",
    ordersCount: (count: number) =>
      `${count} ${count === 1 ? "order" : "orders"}`,
    emptyOrders: "No orders yet. Browse the menu to start ordering.",
    viewMenu: "View Menu",
    viewMyOrders: "View My Orders",
    paidTitle: "Thank you! Your bill is paid.",
    paidSub: "Hope to see you again at Linn Noodle",
    sizeNames: { small: "Small", normal: "Normal", large: "Large" },
    sizePrices: { small: "–฿10", normal: "Standard", large: "+฿15" },
    spiceNames: {
      none: "No Spice",
      mild: "Mild",
      medium: "Medium",
      hot: "Hot",
    },
    exclusions: {
      peanuts: "Peanuts",
      garlic: "Garlic",
      onion: "Onion",
      coriander: "Coriander",
      msg: "MSG",
    },
  },
  my: {
    table: "စားပွဲ ၀၅",
    greeting: "ဘာစားချင်ပါသလဲ?",
    subtitle: "သင့်အတွက် လတ်လတ်ဆတ်ဆတ် ပြင်ဆင်ပေးထားပါတယ်",
    add: "ထည့်မည်",
    soldOut: "ကုန်သွားပါပြီ",
    soldOutInCart:
      "ဟင်းလျာအချို့ ကုန်သွားပါပြီ။ အော်ဒါတင်ရန် ၎င်းတို့ကို ဖယ်ရှားပါ။",
    cart: "ခြင်း",
    menu: "မီနူး",
    close: "ပိတ်မည်",
    size: "အရွယ်အစား",
    required: "ရွေးရန်လိုသည်",
    spice: "အစပ်အဆင့်",
    dontInclude: "မထည့်ပါနှင့်",
    cooked: "ဘယ်လိုချက်ပေးရမလဲ?",
    notePlaceholder: "ဥပမာ - ဟင်းရည်ပို၊ ခေါက်ဆွဲပျော့၊ ဆော့စ်ခွဲ",
    other: "အခြား...",
    quantity: "အရေအတွက်",
    addToCart: "ခြင်းထဲထည့်မည်",
    updateCart: "ပြင်ဆင်ပြီး",
    yourCart: "သင့်ခြင်း",
    cartSubtitle: "မှာယူမီ ရွေးချယ်မှုများကို စစ်ဆေးပါ",
    emptyCart: "ခြင်းထဲတွင် မရှိသေးပါ",
    emptySubtitle: "မီနူးမှ စားစရာတစ်ခုခု ရွေးပါ။",
    browseMenu: "မီနူးကြည့်မည်",
    edit: "ပြင်မည်",
    remove: "ဖယ်မည်",
    no: "မပါ",
    total: "စုစုပေါင်း",
    placeOrder: "မှာယူမည်",
    sent: "သင့်အော်ဒါကို မီးဖိုချောင်သို့ ပို့ပြီးပါပြီ!",
    orderNumber: "အော်ဒါနံပါတ်",
    orderMore: "ထပ်မှာမည်",
    status: "အော်ဒါအခြေအနေ",
    received: "လက်ခံပြီး",
    cooking: "ချက်နေသည်",
    ready: "အဆင်သင့်",
    served: "ပွဲချပြီး",
    myOrders: "ကျွန်ုပ်၏ အော်ဒါများ",
    myOrdersSub: "နောက်ဆုံး ငွေရှင်းပြီးချိန်မှစ၍ ဤစားပွဲတွင် မှာထားသမျှ။",
    subtotal: "စုစုပေါင်း",
    totalToPay: "ပေးချေရမည့် ငွေ",
    unpaid: "မပေးရသေး",
    payHelper: "စားသောက်ပြီးပါက ငွေကိုင်ထံတွင် ပေးချေပါ။",
    ordersCount: (count: number) => `အော်ဒါ ${count} ခု`,
    emptyOrders: "အော်ဒါ မရှိသေးပါ။ မီနူးကို ကြည့်ပြီး မှာယူပါ။",
    viewMenu: "မီနူး ကြည့်ရန်",
    viewMyOrders: "ကျွန်ုပ်၏ အော်ဒါများ ကြည့်ရန်",
    paidTitle: "ကျေးဇူးတင်ပါသည်! ငွေရှင်းပြီးပါပြီ။",
    paidSub: "Linn Noodle တွင် နောက်တစ်ကြိမ် ပြန်လည်တွေ့ဆုံရန် မျှော်လင့်ပါသည်",
    sizeNames: { small: "အသေး", normal: "ပုံမှန်", large: "အကြီး" },
    sizePrices: { small: "–฿10", normal: "ပုံမှန်", large: "+฿15" },
    spiceNames: {
      none: "မစပ်",
      mild: "အနည်းငယ်",
      medium: "အလယ်အလတ်",
      hot: "အရမ်းစပ်",
    },
    exclusions: {
      peanuts: "မြေပဲ",
      garlic: "ကြက်သွန်ဖြူ",
      onion: "ကြက်သွန်နီ",
      coriander: "နံနံပင်",
      msg: "အချိုမှုန့်",
    },
  },
  zh: {
    table: "桌号 05",
    greeting: "今天想吃什么？",
    subtitle: "新鲜现做，只为你",
    add: "添加",
    soldOut: "售罄",
    soldOutInCart: "部分菜品刚刚售罄，请移除后再下单。",
    cart: "购物车",
    menu: "菜单",
    close: "关闭",
    size: "份量",
    required: "必选",
    spice: "辣度",
    dontInclude: "不要添加",
    cooked: "特别烹饪要求",
    notePlaceholder: "例如：多汤、面煮软、酱汁分开",
    other: "其他...",
    quantity: "数量",
    addToCart: "加入购物车",
    updateCart: "更新商品",
    yourCart: "购物车",
    cartSubtitle: "下单前请确认选择",
    emptyCart: "购物车还是空的",
    emptySubtitle: "从菜单中添加一些美味吧。",
    browseMenu: "浏览菜单",
    edit: "编辑",
    remove: "移除",
    no: "不要",
    total: "总计",
    placeOrder: "确认下单",
    sent: "您的订单已发送到厨房！",
    orderNumber: "订单号",
    orderMore: "继续点餐",
    status: "订单状态",
    received: "已接单",
    cooking: "制作中",
    ready: "可取餐",
    served: "已上菜",
    myOrders: "我的订单",
    myOrdersSub: "自上次结账以来本桌的所有订单。",
    subtotal: "小计",
    totalToPay: "应付金额",
    unpaid: "未付款",
    payHelper: "用餐结束后请到收银台付款。",
    ordersCount: (count: number) => `${count} 个订单`,
    emptyOrders: "还没有订单。浏览菜单开始点餐吧。",
    viewMenu: "查看菜单",
    viewMyOrders: "查看我的订单",
    paidTitle: "谢谢！您已结账。",
    paidSub: "期待您再次光临 Linn Noodle",
    sizeNames: { small: "小份", normal: "标准", large: "大份" },
    sizePrices: { small: "–฿10", normal: "标准", large: "+฿15" },
    spiceNames: { none: "不辣", mild: "微辣", medium: "中辣", hot: "特辣" },
    exclusions: {
      peanuts: "花生",
      garlic: "大蒜",
      onion: "洋葱",
      coriander: "香菜",
      msg: "味精",
    },
  },
}


const sizes: Size[] = ["small", "normal", "large"]
const spices: Spice[] = ["none", "mild", "medium", "hot"]
const exclusionKeys = [
  "peanuts",
  "garlic",
  "onion",
  "coriander",
  "msg",
] as const
const sizeAdjustment: Record<Size, number> = {
  small: -10,
  normal: 0,
  large: 15,
}
const chiliCount: Record<Spice, number> = {
  none: 0,
  mild: 1,
  medium: 2,
  hot: 3,
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

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-[18px]"
      fill="none"
    >
      <path
        d="M10 4v12M4 10h12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none">
      <path
        d="M3.5 4h2l1.7 10.2a2 2 0 0 0 2 1.7h7.9a2 2 0 0 0 1.9-1.5L20.5 8H6.2M9.2 20a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6ZM17.5 20a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
      <path
        d="m12.5 4.5-5.5 5 5.5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="size-12" fill="none">
      <path
        d="m13 24.5 7.2 7L35.5 16"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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

function QuantityStepper({
  value,
  onChange,
  small = false,
}: {
  value: number
  onChange: (value: number) => void
  small?: boolean
}) {
  return (
    <div className={small ? "quantity-stepper compact" : "quantity-stepper"}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        −
      </button>
      <span>{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  )
}

function ReceiptIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[22px]" fill="none">
      <path
        d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3v-17Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 8.5h6M9 12h6M9 15.5h3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Header({
  language,
  setLanguage,
  ordersCount,
  ordersActive,
  onOpenOrders,
}: {
  language: Language
  setLanguage: (language: Language) => void
  ordersCount: number
  ordersActive: boolean
  onOpenOrders: () => void
}) {
  const t = copy[language]
  return (
    <header className="topbar">
      <div className="brand-wrap">
        <BowlMark />
        <div className="min-w-0">
          <p className="brand-name">Linn Noodle</p>
          <p className="table-number">{t.table}</p>
        </div>
      </div>
      <div className="topbar-actions">
        <button
          type="button"
          className={ordersActive ? "my-orders-button active" : "my-orders-button"}
          aria-label={`${t.myOrders}${ordersCount ? `, ${ordersCount}` : ""}`}
          onClick={onOpenOrders}
        >
          <span className="my-orders-icon">
            <ReceiptIcon />
            {ordersCount > 0 && (
              <span className="my-orders-badge">{ordersCount}</span>
            )}
          </span>
          <span className="my-orders-label">{t.myOrders}</span>
        </button>
        <label className="language-select">
          <span className="sr-only">Language</span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
          >
            <option value="my">မြန်မာ</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
          <ChevronIcon />
        </label>
      </div>
    </header>
  )
}

const statusSteps: OrderStatus[] = orderStatuses

function StatusTracker({
  status,
  language,
}: {
  status: OrderStatus
  language: Language
}) {
  const t = copy[language]
  const reached = statusSteps.indexOf(status)
  return (
    <div className="status-tracker">
      {statusSteps.map((step, index) => (
        <div className="status-step-wrap" key={step}>
          {index > 0 && (
            <div
              className={index <= reached ? "status-line done" : "status-line"}
            />
          )}
          <div
            className={`status-step ${step}${index <= reached ? " active" : ""}`}
          >
            <span className="status-dot">
              {index < reached || (index === reached && step === "served") ? (
                <CheckIcon />
              ) : (
                index + 1
              )}
            </span>
            <strong>{t[step]}</strong>
          </div>
        </div>
      ))}
    </div>
  )
}

const formatTime = (time: number, language: Language) =>
  new Date(time).toLocaleTimeString(language === "zh" ? "zh-CN" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

function OrderCard({ order, language }: { order: Order; language: Language }) {
  const t = copy[language]
  const step = statusSteps.indexOf(order.status)
  const details = (line: OrderLine) => {
    const parts: string[] = [t.sizeNames[line.size]]
    if (!line.isDrink) parts.push(t.spiceNames[line.spice])
    const excluded = [
      ...line.exclusions.map(
        (key) => t.exclusions[key as keyof typeof t.exclusions] ?? key,
      ),
      line.otherExclusion,
    ].filter(Boolean)
    if (excluded.length) parts.push(`${t.no}: ${excluded.join(", ")}`)
    return parts.join(" · ")
  }

  return (
    <article className={`history-card status-${order.status}`}>
      <header className="history-head">
        <p className="history-number">
          #{order.number} · {formatTime(order.placedAt, language)}
        </p>
        <span className={`history-badge badge-${order.status}`}>
          {t[order.status]}
        </span>
      </header>
      <div
        className="history-progress"
        role="progressbar"
        aria-label={t.status}
        aria-valuemin={1}
        aria-valuemax={statusSteps.length}
        aria-valuenow={step + 1}
        aria-valuetext={t[order.status]}
      >
        {statusSteps.map((entry, index) => (
          <span key={entry} className={index <= step ? "filled" : ""} />
        ))}
      </div>
      <ul className="history-lines">
        {order.lines.map((line, index) => (
          <li key={index}>
            <div className="history-line-main">
              <strong>
                {line.quantity} × {pick(line.name, language)}
              </strong>
              <span>฿{line.lineTotal}</span>
            </div>
            <p className="history-line-detail">{details(line)}</p>
            {line.note && (
              <p className="history-line-detail">“{line.note}”</p>
            )}
          </li>
        ))}
      </ul>
      <footer className="history-subtotal">
        <span>{t.subtotal}</span>
        <strong>฿{order.total}</strong>
      </footer>
    </article>
  )
}

export default function App() {
  const [language, setLanguage] = useState<Language>("en")
  const { items: menuItems, categories } = useMenu()
  const [activeCategory, setActiveCategory] = useState("noodles")
  const [screen, setScreen] = useState<Screen>("menu")
  const [cartState, setCart] = useState<CartItem[]>([])
  const [draft, setDraft] = useState<ItemDraft | null>(null)
  const [lastOrderId, setLastOrderId] = useState<string | null>(null)
  const orderState = useOrders()
  const t = copy[language]

  // Orders for this table since the last payment, newest first.
  const myOrders = openOrdersFor(orderState.orders, CUSTOMER_TABLE)
  const amountToPay = myOrders.reduce((sum, order) => sum + order.total, 0)
  const lastOrder = orderState.orders.find((order) => order.id === lastOrderId)
  // Set when the cashier marks this table as paid (possibly from another tab).
  const payment = unseenCustomerPayment(orderState)

  useEffect(() => {
    if (!payment) return
    setCart([])
    setDraft(null)
  }, [payment])

  const go = (next: Screen) => {
    setScreen(next)
    window.scrollTo({ top: 0 })
  }

  const placeOrder = () => {
    const lines: OrderLine[] = cart.map((line) => {
      const item = findItem(line.itemId)!
      return {
        itemId: item.id,
        name: item.name,
        isDrink: item.category === "drinks",
        quantity: line.quantity,
        size: line.size,
        spice: line.spice,
        exclusions: line.exclusions,
        otherExclusion: line.otherExclusion.trim(),
        note: line.note.trim(),
        lineTotal: linePrice(line),
      }
    })
    const order = orderActions.placeOrder(CUSTOMER_TABLE, lines)
    setLastOrderId(order.id)
    setCart([])
    go("confirmation")
  }

  const finishPayment = (next: Screen) => {
    if (payment) orderActions.acknowledgePayment(payment.id)
    setLastOrderId(null)
    go(next)
  }

  const findItem = (id: number) =>
    menuItems.find((candidate) => candidate.id === id)
  // Items the owner deleted drop out of the cart automatically.
  const cart = cartState.filter((line) => findItem(line.itemId))
  const cartHasSoldOut = cart.some((line) => findItem(line.itemId)?.soldOut)

  // Only show categories that have something in them.
  const visibleCategories = categories.filter((category) =>
    menuItems.some((item) => item.category === category.id),
  )
  const currentCategory = visibleCategories.some(
    (category) => category.id === activeCategory,
  )
    ? activeCategory
    : (visibleCategories[0]?.id ?? "")

  const visibleItems = useMemo(
    () => menuItems.filter((item) => item.category === currentCategory),
    [menuItems, currentCategory],
  )
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const linePrice = (cartItem: ItemDraft) => {
    const item = findItem(cartItem.itemId)
    if (!item) return 0
    return (item.price + sizeAdjustment[cartItem.size]) * cartItem.quantity
  }
  const cartTotal = cart.reduce((total, item) => total + linePrice(item), 0)

  // Close the detail sheet if its dish is deleted or sold out meanwhile.
  const draftItem = draft ? findItem(draft.itemId) : undefined
  useEffect(() => {
    if (draft && !draft.cartId && (!draftItem || draftItem.soldOut))
      setDraft(null)
  }, [draft, draftItem])

  const openItem = (item: MenuItem) => {
    if (item.soldOut) return
    setDraft({
      itemId: item.id,
      size: "normal",
      spice: "none",
      exclusions: [],
      otherExclusion: "",
      note: "",
      quantity: 1,
    })
  }

  const editItem = (item: CartItem) => setDraft({ ...item })

  const saveDraft = () => {
    if (!draft) return
    if (draft.cartId) {
      setCart((current) =>
        current.map((item) =>
          item.cartId === draft.cartId
            ? { ...draft, cartId: draft.cartId! }
            : item,
        ),
      )
    } else {
      setCart((current) => [...current, { ...draft, cartId: Date.now() }])
    }
    setDraft(null)
  }

  const updateCartQuantity = (cartId: number, quantity: number) => {
    setCart((current) =>
      current.map((item) =>
        item.cartId === cartId ? { ...item, quantity } : item,
      ),
    )
  }

  const orderMore = () => {
    setScreen("menu")
    setActiveCategory(visibleCategories[0]?.id ?? "noodles")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div
      className="app-shell"
      lang={language === "my" ? "my" : language === "zh" ? "zh-Hans" : "en"}
    >
      <Header
        language={language}
        setLanguage={setLanguage}
        ordersCount={myOrders.length}
        ordersActive={screen === "orders"}
        onOpenOrders={() => go("orders")}
      />

      {screen === "menu" && (
        <main>
          <section className="intro">
            <p className="eyebrow">LINN MENU</p>
            <h1>{t.greeting}</h1>
            <p>{t.subtitle}</p>
          </section>
          <nav className="category-strip" aria-label="Menu categories">
            <div className="category-scroll">
              {visibleCategories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={
                    currentCategory === category.id
                      ? "category-tab active"
                      : "category-tab"
                  }
                  aria-pressed={currentCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {pick(category.name, language)}
                </button>
              ))}
            </div>
          </nav>
          <section className="menu-grid" aria-live="polite">
            {visibleItems.map((item) => (
              <article
                className={item.soldOut ? "menu-card sold-out" : "menu-card"}
                key={item.id}
              >
                <button
                  type="button"
                  className="card-detail-button"
                  disabled={item.soldOut}
                  onClick={() => openItem(item)}
                >
                  <div className="image-wrap">
                    <img src={item.image} alt={pick(item.name, language)} />
                    {item.soldOut && (
                      <span className="sold-out-badge">{t.soldOut}</span>
                    )}
                  </div>
                  <div className="card-info">
                    <h2>{pick(item.name, language)}</h2>
                    <p className="price">฿{item.price}</p>
                  </div>
                </button>
                <div className="card-action">
                  <button
                    type="button"
                    className="add-button"
                    disabled={item.soldOut}
                    onClick={() => openItem(item)}
                  >
                    {!item.soldOut && <PlusIcon />}
                    <span>{item.soldOut ? t.soldOut : t.add}</span>
                  </button>
                </div>
              </article>
            ))}
          </section>
          <button
            type="button"
            className="cart-button"
            aria-label={`${t.cart}, ${cartCount}`}
            onClick={() => setScreen("cart")}
          >
            <CartIcon />
            <span>{t.cart}</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </main>
      )}

      {screen === "cart" && (
        <main className="cart-screen">
          <button
            type="button"
            className="back-link"
            onClick={() => setScreen("menu")}
          >
            <ArrowIcon />
            <span>{t.menu}</span>
          </button>
          <div className="screen-title">
            <p className="eyebrow">LINN MENU</p>
            <h1>{t.yourCart}</h1>
            <p>{t.cartSubtitle}</p>
          </div>
          {cart.length === 0 ? (
            <section className="empty-state">
              <div className="empty-icon">
                <CartIcon />
              </div>
              <h2>{t.emptyCart}</h2>
              <p>{t.emptySubtitle}</p>
              <button
                type="button"
                className="primary-button"
                onClick={() => setScreen("menu")}
              >
                {t.browseMenu}
              </button>
            </section>
          ) : (
            <>
              <section className="cart-list">
                {cart.map((cartItem) => {
                  const item = findItem(cartItem.itemId)!
                  const excluded = [
                    ...cartItem.exclusions.map(
                      (key) => t.exclusions[(key as keyof typeof t.exclusions)],
                    ),
                    cartItem.otherExclusion,
                  ].filter(Boolean)
                  return (
                    <article
                      className={
                        item.soldOut ? "cart-item sold-out" : "cart-item"
                      }
                      key={cartItem.cartId}
                    >
                      <img src={item.image} alt="" />
                      <div className="cart-item-body">
                        <div className="cart-item-heading">
                          <h2>{pick(item.name, language)}</h2>
                          <strong>฿{linePrice(cartItem)}</strong>
                        </div>
                        {item.soldOut && (
                          <span className="cart-sold-out">{t.soldOut}</span>
                        )}
                        <p className="item-options">
                          {t.sizeNames[cartItem.size]}
                          {item.category !== "drinks" &&
                            ` · ${t.spiceNames[cartItem.spice]}`}
                          {excluded.length > 0 && (
                            <>
                              <br />
                              {t.no}: {excluded.join(", ")}
                            </>
                          )}
                          {cartItem.note && (
                            <>
                              <br />“{cartItem.note}”
                            </>
                          )}
                        </p>
                        <div className="cart-item-actions">
                          <QuantityStepper
                            small
                            value={cartItem.quantity}
                            onChange={(quantity) =>
                              updateCartQuantity(cartItem.cartId, quantity)
                            }
                          />
                          <button
                            type="button"
                            className="text-action"
                            onClick={() => editItem(cartItem)}
                          >
                            {t.edit}
                          </button>
                          <button
                            type="button"
                            className="text-action remove"
                            onClick={() =>
                              setCart((current) =>
                                current.filter(
                                  (entry) => entry.cartId !== cartItem.cartId,
                                ),
                              )
                            }
                          >
                            {t.remove}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </section>
              <section className="cart-summary">
                {cartHasSoldOut && (
                  <p className="cart-warning" role="alert">
                    {t.soldOutInCart}
                  </p>
                )}
                <div>
                  <span>{t.total}</span>
                  <strong>฿{cartTotal}</strong>
                </div>
                <button
                  type="button"
                  className="primary-button"
                  disabled={cartHasSoldOut}
                  onClick={placeOrder}
                >
                  {t.placeOrder} · ฿{cartTotal}
                </button>
              </section>
            </>
          )}
        </main>
      )}

      {screen === "confirmation" && (
        <main className="confirmation-screen">
          <section className="confirmation-card">
            <div className="success-mark">
              <CheckIcon />
            </div>
            <h1>{t.sent}</h1>
            <div className="order-details">
              <div>
                <span>{t.orderNumber}</span>
                <strong>{lastOrder ? `#${lastOrder.number}` : "—"}</strong>
              </div>
              <div>
                <span>{t.table}</span>
                <strong>{CUSTOMER_TABLE}</strong>
              </div>
            </div>
            <div className="tracker-wrap">
              <p className="section-label">{t.status}</p>
              <StatusTracker
                status={lastOrder?.status ?? "received"}
                language={language}
              />
            </div>
            <div className="confirmation-actions">
              <button
                type="button"
                className="secondary-cta"
                onClick={() => go("orders")}
              >
                <ReceiptIcon />
                <span>{t.viewMyOrders}</span>
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={orderMore}
              >
                <ArrowIcon />
                <span>{t.orderMore}</span>
              </button>
            </div>
          </section>
        </main>
      )}

      {screen === "orders" && (
        <main className="orders-screen">
          <button
            type="button"
            className="back-link"
            onClick={() => go("menu")}
          >
            <ArrowIcon />
            <span>{t.menu}</span>
          </button>
          <div className="screen-title">
            <p className="eyebrow">LINN MENU</p>
            <h1>
              {t.myOrders} – {t.table}
            </h1>
            <p>{t.myOrdersSub}</p>
          </div>

          {myOrders.length === 0 ? (
            <section className="empty-state">
              <div className="empty-icon">
                <ReceiptIcon />
              </div>
              <p className="empty-orders-text">{t.emptyOrders}</p>
              <button
                type="button"
                className="primary-button"
                onClick={() => go("menu")}
              >
                {t.viewMenu}
              </button>
            </section>
          ) : (
            <>
              <section className="order-history">
                {myOrders.map((order) => (
                  <OrderCard key={order.id} order={order} language={language} />
                ))}
                <button
                  type="button"
                  className="secondary-cta order-more-cta"
                  onClick={orderMore}
                >
                  <ArrowIcon />
                  <span>{t.orderMore}</span>
                </button>
              </section>
              <section className="cart-summary pay-summary">
                <div>
                  <span>
                    {t.totalToPay}
                    <small>{t.ordersCount(myOrders.length)}</small>
                  </span>
                  <strong>฿{amountToPay}</strong>
                </div>
                <p className="pay-status">
                  <span className="unpaid-label">{t.unpaid}</span>
                  {t.payHelper}
                </p>
              </section>
            </>
          )}
        </main>
      )}

      {payment && (
        <div
          className="paid-screen"
          role="dialog"
          aria-modal="true"
          aria-labelledby="paid-title"
        >
          <div className="paid-mark">
            <CheckIcon />
          </div>
          <h1 id="paid-title">{t.paidTitle}</h1>
          <p>{t.paidSub}</p>
          <p className="paid-amount">฿{payment.total}</p>
          <div className="paid-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => finishPayment("menu")}
            >
              {t.viewMenu}
            </button>
            <button
              type="button"
              className="secondary-cta"
              onClick={() => finishPayment("orders")}
            >
              <ReceiptIcon />
              <span>{t.myOrders}</span>
            </button>
          </div>
        </div>
      )}

      {draft && draftItem && (
        <div
          className="sheet-overlay"
          role="presentation"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setDraft(null)
          }
        >
          <section
            className="detail-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
          >
            {(() => {
              const item = draftItem!
              const currentPrice = linePrice(draft)
              return (
                <>
                  <div className="sheet-grabber" />
                  <button
                    type="button"
                    className="sheet-close"
                    onClick={() => setDraft(null)}
                  >
                    <span>×</span>
                    {t.close}
                  </button>
                  <div className="sheet-scroll">
                    <img
                      className="detail-image"
                      src={item.image}
                      alt={pick(item.name, language)}
                    />
                    <div className="detail-content">
                      <div className="detail-heading">
                        <div>
                          <h2 id="detail-title">{pick(item.name, language)}</h2>
                          <p>{pick(item.description, language)}</p>
                        </div>
                        <strong>฿{item.price}</strong>
                      </div>

                      <fieldset className="option-group">
                        <legend>
                          {t.size} <span>{t.required}</span>
                        </legend>
                        <div className="size-options">
                          {sizes.map((size) => (
                            <button
                              type="button"
                              key={size}
                              className={
                                draft.size === size
                                  ? "option-pill selected"
                                  : "option-pill"
                              }
                              aria-pressed={draft.size === size}
                              onClick={() => setDraft({ ...draft, size })}
                            >
                              <strong>{t.sizeNames[size]}</strong>
                              <small>{t.sizePrices[size]}</small>
                            </button>
                          ))}
                        </div>
                      </fieldset>

                      {item.category !== "drinks" && (
                        <fieldset className="option-group">
                          <legend>{t.spice}</legend>
                          <div className="spice-options">
                            {spices.map((spice) => (
                              <button
                                type="button"
                                key={spice}
                                className={
                                  draft.spice === spice
                                    ? "option-pill selected"
                                    : "option-pill"
                                }
                                aria-pressed={draft.spice === spice}
                                onClick={() => setDraft({ ...draft, spice })}
                              >
                                <strong>{t.spiceNames[spice]}</strong>
                                {chiliCount[spice] > 0 && (
                                  <small aria-hidden="true">
                                    {"🌶".repeat(chiliCount[spice])}
                                  </small>
                                )}
                              </button>
                            ))}
                          </div>
                        </fieldset>
                      )}

                      <fieldset className="option-group">
                        <legend>{t.dontInclude}</legend>
                        <div className="chip-options">
                          {exclusionKeys.map((key) => (
                            <button
                              type="button"
                              key={key}
                              className={
                                draft.exclusions.includes(key)
                                  ? "choice-chip selected"
                                  : "choice-chip"
                              }
                              aria-pressed={draft.exclusions.includes(key)}
                              onClick={() =>
                                setDraft({
                                  ...draft,
                                  exclusions: draft.exclusions.includes(key)
                                    ? draft.exclusions.filter(
                                        (entry) => entry !== key,
                                      )
                                    : [...draft.exclusions, key],
                                })
                              }
                            >
                              {draft.exclusions.includes(key) && <span>✓</span>}
                              {t.exclusions[key]}
                            </button>
                          ))}
                        </div>
                        <input
                          className="text-input"
                          value={draft.otherExclusion}
                          onChange={(event) =>
                            setDraft({
                              ...draft,
                              otherExclusion: event.target.value,
                            })
                          }
                          placeholder={t.other}
                        />
                      </fieldset>

                      <label className="option-group input-label">
                        <span>{t.cooked}</span>
                        <textarea
                          className="text-input note-input"
                          rows={3}
                          value={draft.note}
                          onChange={(event) =>
                            setDraft({ ...draft, note: event.target.value })
                          }
                          placeholder={t.notePlaceholder}
                        />
                      </label>

                      <div className="detail-footer-row">
                        <span className="section-label">{t.quantity}</span>
                        <QuantityStepper
                          value={draft.quantity}
                          onChange={(quantity) =>
                            setDraft({ ...draft, quantity })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sheet-action">
                    <button
                      type="button"
                      className="primary-button add-cart-submit"
                      onClick={saveDraft}
                    >
                      {draft.cartId ? t.updateCart : t.addToCart} · ฿
                      {currentPrice}
                    </button>
                  </div>
                </>
              )
            })()}
          </section>
        </div>
      )}
    </div>
  )
}
