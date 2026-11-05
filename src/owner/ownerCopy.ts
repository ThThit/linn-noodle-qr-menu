import type { Language } from "../staff/staffCopy"
import type { OrderStatus, SummaryId } from "./ownerData"

export type { Language }
export { dishNames } from "../staff/staffCopy"

/** Date locales; numbers stay in Latin digits so they match the ฿ amounts. */
export const dateLocales: Record<Language, string> = {
  en: "en-GB",
  my: "my-MM-u-nu-latn",
  zh: "zh-CN",
}

type OwnerCopy = {
  language: string
  // Login
  signIn: string
  username: string
  usernamePlaceholder: string
  password: string
  passwordPlaceholder: string
  show: string
  hide: string
  loginError: string
  logIn: string
  demoHint: string
  // Layout
  title: string
  role: string
  nav: { dashboard: string; qr: string; menu: string; settings: string }
  logOut: string
  comingSoon: string
  // Dashboard
  greeting: { morning: string; afternoon: string; evening: string }
  intro: string
  summary: Record<SummaryId, { label: string; helper: string }>
  trend: (direction: "up" | "down", percent: number) => string
  moneyEarned: string
  thisWeek: string
  thisMonth: string
  totalWeek: string
  totalMonth: string
  bestDay: string
  averagePerDay: string
  today: string
  chartHint: string
  bestSelling: string
  thisMonthSub: string
  sold: (count: number) => string
  todaysOrders: string
  ordersOn: (date: string) => string
  latestOrders: string
  ordersShown: (count: number) => string
  searchPlaceholder: string
  chooseDate: string
  backToToday: string
  noOrders: string
  tryDifferent: string
  noOrdersDay: string
  columns: {
    order: string
    table: string
    time: string
    items: string
    total: string
    status: string
  }
  tableNumber: (table: string) => string
  status: Record<OrderStatus, string>
  busyHours: string
  busySub: string
  busiestTime: string
  ordersCount: (count: number) => string
  hour: (hour: number) => string
  itemSeparator: string
}

export const ownerCopy: Record<Language, OwnerCopy> = {
  en: {
    language: "Language",
    signIn: "Owner sign in",
    username: "Username",
    usernamePlaceholder: "Your username",
    password: "Password",
    passwordPlaceholder: "Your password",
    show: "Show",
    hide: "Hide",
    loginError: "Please type your username and password.",
    logIn: "Log in",
    demoHint: "Demo: type any username and password.",
    title: "Linn Noodle – Owner",
    role: "Owner",
    nav: {
      dashboard: "Dashboard",
      qr: "QR Codes",
      menu: "Menu Manager",
      settings: "Settings",
    },
    logOut: "Log out",
    comingSoon: "This page is coming soon.",
    greeting: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
    },
    intro: "Here is how Linn Noodle is doing today.",
    summary: {
      revenue: { label: "Today's Revenue", helper: "Money taken so far today" },
      orders: { label: "Today's Orders", helper: "Orders placed today" },
      average: {
        label: "Average Order Value",
        helper: "Average spent per order",
      },
      tables: { label: "Active Tables", helper: "Tables eating right now" },
    },
    trend: (direction, percent) =>
      `${percent}% ${direction === "up" ? "more" : "less"} vs yesterday`,
    moneyEarned: "Money Earned",
    thisWeek: "This Week",
    thisMonth: "This Month",
    totalWeek: "Total this week",
    totalMonth: "Total this month",
    bestDay: "Best day",
    averagePerDay: "Average per day",
    today: "Today",
    chartHint: "Point at a bar to see that day's amount.",
    bestSelling: "Best-Selling Items",
    thisMonthSub: "This month",
    sold: (count) => `${count} sold`,
    todaysOrders: "Today's Orders",
    ordersOn: (date) => `Orders on ${date}`,
    latestOrders: "Latest orders",
    ordersShown: (count) => `${count} ${count === 1 ? "order" : "orders"} shown`,
    searchPlaceholder: "Search order, table or food",
    chooseDate: "Choose a date",
    backToToday: "Back to today",
    noOrders: "No orders found",
    tryDifferent: "Try a different search word.",
    noOrdersDay: "There are no orders saved for this day.",
    columns: {
      order: "Order No.",
      table: "Table",
      time: "Time",
      items: "Items",
      total: "Total",
      status: "Status",
    },
    tableNumber: (table) => `Table ${table}`,
    status: {
      new: "New",
      cooking: "Cooking",
      ready: "Ready",
      served: "Served",
    },
    busyHours: "Busy Hours",
    busySub: "Orders per hour today",
    busiestTime: "Busiest time:",
    ordersCount: (count) => `${count} ${count === 1 ? "order" : "orders"}`,
    hour: (hour) =>
      hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`,
    itemSeparator: ", ",
  },
  my: {
    language: "ဘာသာစကား",
    signIn: "ပိုင်ရှင် အကောင့်ဝင်ရန်",
    username: "အသုံးပြုသူအမည်",
    usernamePlaceholder: "သင့်အသုံးပြုသူအမည်",
    password: "စကားဝှက်",
    passwordPlaceholder: "သင့်စကားဝှက်",
    show: "ပြရန်",
    hide: "ဖျောက်ရန်",
    loginError: "အသုံးပြုသူအမည်နှင့် စကားဝှက်ကို ရိုက်ထည့်ပါ။",
    logIn: "အကောင့်ဝင်မည်",
    demoHint: "စမ်းသပ်ရန်: မည်သည့်အမည်နှင့် စကားဝှက်မဆို ရိုက်ထည့်နိုင်သည်။",
    title: "Linn Noodle – ပိုင်ရှင်",
    role: "ပိုင်ရှင်",
    nav: {
      dashboard: "အနှစ်ချုပ်",
      qr: "QR ကုဒ်များ",
      menu: "မီနူး စီမံရန်",
      settings: "ဆက်တင်များ",
    },
    logOut: "ထွက်မည်",
    comingSoon: "ဤစာမျက်နှာကို မကြာမီ ထည့်သွင်းပါမည်။",
    greeting: {
      morning: "မင်္ဂလာနံနက်ခင်းပါ",
      afternoon: "မင်္ဂလာနေ့လယ်ခင်းပါ",
      evening: "မင်္ဂလာညနေခင်းပါ",
    },
    intro: "ယနေ့ Linn Noodle ၏ အခြေအနေ",
    summary: {
      revenue: { label: "ယနေ့ ဝင်ငွေ", helper: "ယနေ့ ရရှိထားသော ငွေ" },
      orders: { label: "ယနေ့ အော်ဒါများ", helper: "ယနေ့ မှာယူထားသော အော်ဒါ" },
      average: {
        label: "အော်ဒါတစ်ခု ပျမ်းမျှ",
        helper: "အော်ဒါတစ်ခုလျှင် ပျမ်းမျှ သုံးစွဲငွေ",
      },
      tables: { label: "လက်ရှိ စားပွဲများ", helper: "ယခု စားသောက်နေသော စားပွဲ" },
    },
    trend: (direction, percent) =>
      `မနေ့ကထက် ${percent}% ${direction === "up" ? "ပိုများ" : "လျော့"}`,
    moneyEarned: "ရရှိငွေ",
    thisWeek: "ဤအပတ်",
    thisMonth: "ဤလ",
    totalWeek: "ဤအပတ် စုစုပေါင်း",
    totalMonth: "ဤလ စုစုပေါင်း",
    bestDay: "အရောင်းရဆုံးနေ့",
    averagePerDay: "တစ်ရက် ပျမ်းမျှ",
    today: "ယနေ့",
    chartHint: "ဘားတစ်ခုပေါ် ညွှန်ပြီး ထိုနေ့၏ ပမာဏကို ကြည့်ပါ။",
    bestSelling: "အရောင်းရဆုံး ဟင်းလျာများ",
    thisMonthSub: "ဤလ",
    sold: (count) => `${count} ပွဲ ရောင်းရ`,
    todaysOrders: "ယနေ့ အော်ဒါများ",
    ordersOn: (date) => `${date} ၏ အော်ဒါများ`,
    latestOrders: "နောက်ဆုံး အော်ဒါများ",
    ordersShown: (count) => `${count} ခု ပြသထားသည်`,
    searchPlaceholder: "အော်ဒါ၊ စားပွဲ သို့မဟုတ် ဟင်းလျာ ရှာရန်",
    chooseDate: "ရက်စွဲ ရွေးရန်",
    backToToday: "ယနေ့သို့ ပြန်သွားရန်",
    noOrders: "အော်ဒါ မတွေ့ပါ",
    tryDifferent: "အခြားစကားလုံးဖြင့် ရှာကြည့်ပါ။",
    noOrdersDay: "ဤနေ့အတွက် အော်ဒါ မရှိပါ။",
    columns: {
      order: "အော်ဒါ နံပါတ်",
      table: "စားပွဲ",
      time: "အချိန်",
      items: "ဟင်းလျာများ",
      total: "စုစုပေါင်း",
      status: "အခြေအနေ",
    },
    tableNumber: (table) => `စားပွဲ ${table}`,
    status: {
      new: "အသစ်",
      cooking: "ချက်နေသည်",
      ready: "အသင့်",
      served: "ပွဲချပြီး",
    },
    busyHours: "လူများသော အချိန်များ",
    busySub: "ယနေ့ တစ်နာရီလျှင် အော်ဒါ",
    busiestTime: "အများဆုံး အချိန်:",
    ordersCount: (count) => `အော်ဒါ ${count} ခု`,
    hour: (hour) =>
      hour < 12
        ? `မနက် ${hour}`
        : hour < 16
          ? `နေ့လယ် ${hour === 12 ? 12 : hour - 12}`
          : hour < 19
            ? `ညနေ ${hour - 12}`
            : `ည ${hour - 12}`,
    itemSeparator: "၊ ",
  },
  zh: {
    language: "语言",
    signIn: "店主登录",
    username: "用户名",
    usernamePlaceholder: "请输入用户名",
    password: "密码",
    passwordPlaceholder: "请输入密码",
    show: "显示",
    hide: "隐藏",
    loginError: "请输入用户名和密码。",
    logIn: "登录",
    demoHint: "演示：输入任意用户名和密码即可。",
    title: "Linn Noodle – 店主后台",
    role: "店主",
    nav: {
      dashboard: "概览",
      qr: "二维码",
      menu: "菜单管理",
      settings: "设置",
    },
    logOut: "退出登录",
    comingSoon: "此页面即将推出。",
    greeting: { morning: "早上好", afternoon: "下午好", evening: "晚上好" },
    intro: "看看 Linn Noodle 今天的经营情况。",
    summary: {
      revenue: { label: "今日营业额", helper: "今天已收入的金额" },
      orders: { label: "今日订单", helper: "今天下的订单数" },
      average: { label: "平均客单价", helper: "每单平均消费" },
      tables: { label: "使用中餐桌", helper: "正在用餐的餐桌" },
    },
    trend: (direction, percent) =>
      `比昨天${direction === "up" ? "多" : "少"} ${percent}%`,
    moneyEarned: "收入",
    thisWeek: "本周",
    thisMonth: "本月",
    totalWeek: "本周总计",
    totalMonth: "本月总计",
    bestDay: "最佳一天",
    averagePerDay: "日均",
    today: "今天",
    chartHint: "将鼠标移到柱子上可查看当天金额。",
    bestSelling: "畅销菜品",
    thisMonthSub: "本月",
    sold: (count) => `已售 ${count} 份`,
    todaysOrders: "今日订单",
    ordersOn: (date) => `${date} 的订单`,
    latestOrders: "最新订单",
    ordersShown: (count) => `显示 ${count} 单`,
    searchPlaceholder: "搜索订单、桌号或菜品",
    chooseDate: "选择日期",
    backToToday: "回到今天",
    noOrders: "没有找到订单",
    tryDifferent: "换个关键词试试。",
    noOrdersDay: "这一天没有订单记录。",
    columns: {
      order: "订单号",
      table: "桌号",
      time: "时间",
      items: "菜品",
      total: "合计",
      status: "状态",
    },
    tableNumber: (table) => `${table} 号桌`,
    status: {
      new: "新订单",
      cooking: "制作中",
      ready: "待上菜",
      served: "已上菜",
    },
    busyHours: "高峰时段",
    busySub: "今日每小时订单数",
    busiestTime: "最忙时段：",
    ordersCount: (count) => `${count} 单`,
    hour: (hour) =>
      hour < 12
        ? `上午${hour}点`
        : hour === 12
          ? "中午12点"
          : hour < 18
            ? `下午${hour - 12}点`
            : `晚上${hour - 12}点`,
    itemSeparator: "、",
  },
}

// Burmese date names are spelled out here because many browsers ship
// without Burmese calendar data and silently fall back to English.
const myWeekdays = ["တနင်္ဂနွေ", "တနင်္လာ", "အင်္ဂါ", "ဗုဒ္ဓဟူး", "ကြာသပတေး", "သောကြာ", "စနေ"]
const myMonths = ["ဇန်နဝါရီ", "ဖေဖော်ဝါရီ", "မတ်", "ဧပြီ", "မေ", "ဇွန်", "ဇူလိုင်", "ဩဂုတ်", "စက်တင်ဘာ", "အောက်တိုဘာ", "နိုဝင်ဘာ", "ဒီဇင်ဘာ"]

export type DateStyle = "weekday" | "dayMonth" | "weekdayLong" | "full"

export function formatDate(date: Date, language: Language, style: DateStyle) {
  if (language === "my") {
    const weekday = myWeekdays[date.getDay()]
    const dayMonth = `${date.getDate()} ${myMonths[date.getMonth()]}`
    if (style === "weekday") return weekday
    if (style === "dayMonth") return dayMonth
    if (style === "weekdayLong") return `${weekday}၊ ${dayMonth}`
    return `${weekday}၊ ${dayMonth} ${date.getFullYear()}`
  }
  const options: Intl.DateTimeFormatOptions =
    style === "weekday"
      ? { weekday: "short" }
      : style === "dayMonth"
        ? { day: "numeric", month: "short" }
        : style === "weekdayLong"
          ? { weekday: "long", day: "numeric", month: "long" }
          : { weekday: "long", day: "numeric", month: "long", year: "numeric" }
  return date.toLocaleDateString(dateLocales[language], options)
}
