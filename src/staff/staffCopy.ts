import type { DishKey, NoteKey } from "./staffData"

export type StaffTab = "new" | "cooking" | "ready" | "done"

export type Language = "en" | "my" | "zh"

export const locales: Record<Language, string> = {
  en: "en-GB",
  my: "my-MM",
  zh: "zh-CN",
}

export const dishNames: Record<DishKey, Record<Language, string>> = {
  shanNoodle: { en: "Shan Noodle", my: "ရှမ်းခေါက်ဆွဲ", zh: "掸邦面" },
  mohinga: { en: "Mohinga", my: "မုန့်ဟင်းခါး", zh: "缅甸鱼汤面" },
  friedRice: { en: "Fried Rice", my: "ထမင်းကြော်", zh: "缅甸炒饭" },
  tofuFritters: { en: "Tofu Fritters", my: "တို့ဟူးကြော်", zh: "炸豆腐" },
  teaLeafSalad: { en: "Tea Leaf Salad", my: "လက်ဖက်သုပ်", zh: "茶叶沙拉" },
  milkTea: { en: "Burmese Milk Tea", my: "လက်ဖက်ရည်", zh: "缅甸奶茶" },
  limeJuice: { en: "Lime Juice", my: "သံပုရာရည်", zh: "青柠汁" },
}

export const noteNames: Record<NoteKey, Record<Language, string>> = {
  lessSpicy: { en: "less spicy", my: "အစပ်လျှော့", zh: "少辣" },
  noPeanuts: { en: "no peanuts", my: "မြေပဲမထည့်ရ", zh: "不要花生" },
  extraSoup: { en: "extra soup", my: "ဟင်းရည်ပိုထည့်", zh: "多加汤" },
  noIce: { en: "no ice", my: "ရေခဲမထည့်ရ", zh: "不加冰" },
}

type StaffCopy = {
  title: string
  subtitle: string
  simulate: string
  pending: string
  language: string
  tabs: Record<StaffTab, string>
  actions: Record<Exclude<StaffTab, "done">, string>
  table: (table: string) => string
  items: (count: number) => string
  placed: (time: string) => string
  served: (time: string) => string
  elapsed: (minutes: number) => string
  newBadge: string
  completed: string
  hintQueue: string
  hintDone: string
  emptyTitle: string
  emptyNew: string
  emptyOther: string
  waiting: (minutes: number) => string
  customerLink: string
  toastNew: (table: string) => string
  toastMoved: (table: string, stage: string) => string
  noteSeparator: string
  kitchen: string
  drinkBar: string
  sizeNames: { small: string; large: string }
  spiceNames: { none: string; mild: string; medium: string; hot: string }
  exclusionNames: Record<string, string>
  paidTag: string
  billsTab: string
  billsHint: string
  ordersCount: (count: number) => string
  notServed: (count: number) => string
  unpaid: string
  free: string
  billTitle: (table: string) => string
  billSub: string
  total: string
  markPaid: string
  noUnpaid: string
  confirmPaidTitle: (table: string) => string
  confirmPaidText: (amount: string) => string
  confirmPaidYes: string
  cancel: string
  close: string
  toastPaid: (table: string) => string
}

export const staffCopy: Record<Language, StaffCopy> = {
  en: {
    title: "Linn Menu – Kitchen Orders",
    subtitle: "Staff · Kitchen & Cashier",
    simulate: "+ Simulate new order",
    pending: "pending",
    language: "Language",
    tabs: { new: "New", cooking: "Cooking", ready: "Ready", done: "Done" },
    actions: { new: "Start Cooking", cooking: "Mark Ready", ready: "Served" },
    table: (table) => `TABLE ${table}`,
    items: (count) => `${count} ${count === 1 ? "item" : "items"}`,
    placed: (time) => `Placed ${time}`,
    served: (time) => `Served ${time}`,
    elapsed: (minutes) => (minutes < 1 ? "Just now" : `${minutes} min ago`),
    newBadge: "NEW",
    completed: "✓ Completed",
    hintQueue: "Oldest first → serve from the left",
    hintDone: "Most recently served on the right",
    emptyTitle: "No orders here",
    emptyNew: "New orders will slide in here.",
    emptyOther: "Orders appear here as they move along.",
    waiting: (minutes) => `Waiting ${minutes}+ min`,
    customerLink: "← Start screen",
    toastNew: (table) => `New order · Table ${table}`,
    toastMoved: (table, stage) => `Table ${table} → ${stage}`,
    noteSeparator: ", ",
    kitchen: "Kitchen",
    drinkBar: "Drink bar",
    sizeNames: { small: "Small", large: "Large" },
    spiceNames: {
      none: "no spice",
      mild: "mild",
      medium: "medium spicy",
      hot: "very spicy",
    },
    exclusionNames: {
      peanuts: "no peanuts",
      garlic: "no garlic",
      onion: "no onion",
      coriander: "no coriander",
      msg: "no MSG",
    },
    paidTag: "Paid",
    billsTab: "Tables & Bills",
    billsHint: "Tap a table to see its bill",
    ordersCount: (count) => `${count} ${count === 1 ? "order" : "orders"}`,
    notServed: (count) => `${count} not served yet`,
    unpaid: "Unpaid",
    free: "Free",
    billTitle: (table) => `Table ${table}`,
    billSub: "Orders since the last payment",
    total: "Total",
    markPaid: "Mark as Paid",
    noUnpaid: "No unpaid orders at this table.",
    confirmPaidTitle: (table) => `Mark Table ${table} as paid?`,
    confirmPaidText: (amount) =>
      `Collect ${amount} from the customer first. The table's order list will be cleared.`,
    confirmPaidYes: "Yes, it's paid",
    cancel: "Cancel",
    close: "Close",
    toastPaid: (table) => `Table ${table} is paid and now free`,
  },
  my: {
    title: "Linn Menu – မီးဖိုချောင် အော်ဒါများ",
    subtitle: "ဝန်ထမ်း · မီးဖိုချောင်နှင့် ငွေကိုင်",
    simulate: "+ အော်ဒါအသစ် စမ်းသပ်ရန်",
    pending: "စောင့်ဆိုင်းဆဲ",
    language: "ဘာသာစကား",
    tabs: {
      new: "အသစ်",
      cooking: "ချက်နေသည်",
      ready: "အသင့်",
      done: "ပြီးဆုံး",
    },
    actions: {
      new: "ချက်ပြုတ်မည်",
      cooking: "အသင့်ဖြစ်ပြီ",
      ready: "ပွဲချပြီး",
    },
    table: (table) => `စားပွဲ ${table}`,
    items: (count) => `${count} ခု`,
    placed: (time) => `မှာချိန် ${time}`,
    served: (time) => `ပွဲချချိန် ${time}`,
    elapsed: (minutes) => (minutes < 1 ? "ယခုလေးတင်" : `${minutes} မိနစ်က`),
    newBadge: "အသစ်",
    completed: "✓ ပြီးဆုံးပါပြီ",
    hintQueue: "အဟောင်းဆုံးကို ဘယ်ဘက်မှ စတင်ပါ",
    hintDone: "နောက်ဆုံးပွဲချသည်များ ညာဘက်တွင်",
    emptyTitle: "အော်ဒါ မရှိပါ",
    emptyNew: "အော်ဒါအသစ်များ ဤနေရာတွင် ပေါ်လာပါမည်။",
    emptyOther: "အော်ဒါများ ဤအဆင့်သို့ ရောက်လာလျှင် ပေါ်လာပါမည်။",
    waiting: (minutes) => `${minutes}+ မိနစ် စောင့်နေ`,
    customerLink: "← စတင်မျက်နှာ",
    toastNew: (table) => `အော်ဒါအသစ် · စားပွဲ ${table}`,
    toastMoved: (table, stage) => `စားပွဲ ${table} → ${stage}`,
    noteSeparator: "၊ ",
    kitchen: "မီးဖိုချောင်",
    drinkBar: "အဖျော်ယမကာ",
    sizeNames: { small: "အသေး", large: "အကြီး" },
    spiceNames: {
      none: "အစပ်မပါ",
      mild: "အစပ်နည်း",
      medium: "အစပ်အလယ်အလတ်",
      hot: "အစပ်များ",
    },
    exclusionNames: {
      peanuts: "မြေပဲမထည့်ရ",
      garlic: "ကြက်သွန်ဖြူမထည့်ရ",
      onion: "ကြက်သွန်နီမထည့်ရ",
      coriander: "နံနံပင်မထည့်ရ",
      msg: "အချိုမှုန့်မထည့်ရ",
    },
    paidTag: "ပေးပြီး",
    billsTab: "စားပွဲနှင့် ငွေရှင်းရန်",
    billsHint: "စားပွဲကို နှိပ်ပြီး ငွေတောင်းခံလွှာ ကြည့်ပါ",
    ordersCount: (count) => `အော်ဒါ ${count} ခု`,
    notServed: (count) => `${count} ခု မချရသေး`,
    unpaid: "မပေးရသေး",
    free: "အားသည်",
    billTitle: (table) => `စားပွဲ ${table}`,
    billSub: "နောက်ဆုံး ငွေရှင်းပြီးချိန်မှစ၍ အော်ဒါများ",
    total: "စုစုပေါင်း",
    markPaid: "ငွေရှင်းပြီးဟု မှတ်မည်",
    noUnpaid: "ဤစားပွဲတွင် မပေးရသေးသော အော်ဒါ မရှိပါ။",
    confirmPaidTitle: (table) => `စားပွဲ ${table} ကို ငွေရှင်းပြီးဟု မှတ်မလား?`,
    confirmPaidText: (amount) =>
      `ဖောက်သည်ထံမှ ${amount} ကို အရင် လက်ခံပါ။ စားပွဲ၏ အော်ဒါစာရင်း ရှင်းလင်းသွားပါမည်။`,
    confirmPaidYes: "ဟုတ်ကဲ့၊ ပေးပြီးပါပြီ",
    cancel: "မလုပ်တော့ပါ",
    close: "ပိတ်ရန်",
    toastPaid: (table) => `စားပွဲ ${table} ငွေရှင်းပြီး၍ အားပါပြီ`,
  },
  zh: {
    title: "Linn Menu – 厨房订单",
    subtitle: "员工 · 厨房与收银",
    simulate: "+ 模拟新订单",
    pending: "待处理",
    language: "语言",
    tabs: { new: "新订单", cooking: "制作中", ready: "待上菜", done: "已完成" },
    actions: { new: "开始制作", cooking: "制作完成", ready: "已上菜" },
    table: (table) => `${table} 号桌`,
    items: (count) => `${count} 件`,
    placed: (time) => `下单 ${time}`,
    served: (time) => `上菜 ${time}`,
    elapsed: (minutes) => (minutes < 1 ? "刚刚" : `${minutes} 分钟前`),
    newBadge: "新",
    completed: "✓ 已完成",
    hintQueue: "最早的订单在左侧，先到先做",
    hintDone: "最近上菜的在右侧",
    emptyTitle: "暂无订单",
    emptyNew: "新订单会出现在这里。",
    emptyOther: "订单进入此阶段后会显示在这里。",
    waiting: (minutes) => `等待 ${minutes}+ 分钟`,
    customerLink: "← 返回起始页",
    toastNew: (table) => `新订单 · ${table} 号桌`,
    toastMoved: (table, stage) => `${table} 号桌 → ${stage}`,
    noteSeparator: "，",
    kitchen: "厨房",
    drinkBar: "饮品吧",
    sizeNames: { small: "小份", large: "大份" },
    spiceNames: {
      none: "不辣",
      mild: "微辣",
      medium: "中辣",
      hot: "特辣",
    },
    exclusionNames: {
      peanuts: "不要花生",
      garlic: "不要蒜",
      onion: "不要洋葱",
      coriander: "不要香菜",
      msg: "不要味精",
    },
    paidTag: "已付款",
    billsTab: "餐桌与账单",
    billsHint: "点击餐桌查看账单",
    ordersCount: (count) => `${count} 个订单`,
    notServed: (count) => `${count} 单未上菜`,
    unpaid: "未付款",
    free: "空闲",
    billTitle: (table) => `${table} 号桌`,
    billSub: "自上次结账以来的订单",
    total: "合计",
    markPaid: "标记为已付款",
    noUnpaid: "本桌没有未付款的订单。",
    confirmPaidTitle: (table) => `将 ${table} 号桌标记为已付款？`,
    confirmPaidText: (amount) => `请先向顾客收取 ${amount}。本桌的订单列表将被清空。`,
    confirmPaidYes: "确认已付款",
    cancel: "取消",
    close: "关闭",
    toastPaid: (table) => `${table} 号桌已付款，现已空闲`,
  },
}
