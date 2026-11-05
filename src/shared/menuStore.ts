import { useSyncExternalStore } from "react"

// Shared menu data for the whole prototype. The owner's Menu Manager writes
// here and the customer menu reads from it. Saved in localStorage so changes
// survive a refresh and reach other open tabs (UI-only, no backend).

export type Language = "en" | "my" | "zh"
export type Translated = Record<Language, string>

export type MenuCategory = {
  id: string
  name: Translated
}

export type MenuItem = {
  id: number
  name: Translated
  description: Translated
  category: string
  price: number
  image: string
  soldOut?: boolean
}

export type MenuState = {
  categories: MenuCategory[]
  items: MenuItem[]
}

/** Shown for dishes saved without a photo: a soft bowl on cream. */
export const placeholderImage =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f6ead9"/><path d="M130 150h140c-5 50-31 74-70 74s-65-24-70-74Z" fill="#e3836f"/><path d="M165 128c4-17 17-25 32-33M203 128c4-17 17-25 32-33" stroke="#e3836f" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M168 240h64" stroke="#e3836f" stroke-width="12" stroke-linecap="round"/></svg>',
  )

export const defaultCategories: MenuCategory[] = [
  { id: "noodles", name: { en: "Noodles", my: "ခေါက်ဆွဲ", zh: "面食" } },
  { id: "rice", name: { en: "Rice", my: "ထမင်း", zh: "米饭" } },
  { id: "snacks", name: { en: "Fried Snacks", my: "အကြော်", zh: "炸物" } },
  { id: "salads", name: { en: "Salads", my: "အသုပ်", zh: "沙拉" } },
  { id: "drinks", name: { en: "Drinks", my: "အချိုရည်", zh: "饮品" } },
]

export const defaultItems: MenuItem[] = [
  {
    id: 1,
    name: { en: "Shan Noodle", my: "ရှမ်းခေါက်ဆွဲ", zh: "掸邦面" },
    description: {
      en: "Silky rice noodles with chicken, tomato, peanuts and fragrant Shan spices.",
      my: "ကြက်သား၊ ခရမ်းချဉ်သီး၊ မြေပဲနှင့် ရှမ်းဟင်းခတ်အမွှေးအကြိုင်များပါသော ဆန်ခေါက်ဆွဲ။",
      zh: "爽滑米线配鸡肉、番茄、花生和地道掸邦香料。",
    },
    category: "noodles",
    price: 60,
    image:
      "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 2,
    name: { en: "Mohinga", my: "မုန့်ဟင်းခါး", zh: "缅甸鱼汤面" },
    description: {
      en: "Myanmar's comforting rice noodle soup in a rich, aromatic fish broth.",
      my: "မွှေးပျံ့ကြွယ်ဝသော ငါးဟင်းရည်နှင့် မြန်မာ့ရိုးရာ ဆန်ခေါက်ဆွဲဟင်း။",
      zh: "经典缅甸米线，搭配浓郁芳香的鱼汤。",
    },
    category: "noodles",
    price: 70,
    image:
      "https://images.unsplash.com/photo-1730622424540-f4af08184fb6?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 3,
    name: { en: "Fried Rice", my: "ထမင်းကြော်", zh: "缅甸炒饭" },
    description: {
      en: "Wok-fried jasmine rice with vegetables, egg and our house seasoning.",
      my: "ဟင်းသီးဟင်းရွက်၊ ကြက်ဥနှင့် ဆိုင်အထူးဟင်းခတ်အရသာပါသော ထမင်းကြော်။",
      zh: "茉莉香米配蔬菜、鸡蛋和本店秘制调味大火翻炒。",
    },
    category: "rice",
    price: 80,
    image:
      "https://images.unsplash.com/photo-1677366827953-315db98495e6?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 4,
    name: { en: "Tofu Fritters", my: "တို့ဟူးကြော်", zh: "炸豆腐" },
    description: {
      en: "Golden chickpea tofu fritters, crisp outside and soft in the middle.",
      my: "အပြင်ဘက်ကြွပ်ပြီး အတွင်းသားနူးညံ့သော ရွှေရောင်ပဲတို့ဟူးကြော်။",
      zh: "金黄鹰嘴豆豆腐，外酥里嫩。",
    },
    category: "snacks",
    price: 50,
    image:
      "https://images.unsplash.com/photo-1619778466226-618cae61f402?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 5,
    name: { en: "Tea Leaf Salad", my: "လက်ဖက်သုပ်", zh: "茶叶沙拉" },
    description: {
      en: "Fermented tea leaves tossed with cabbage, tomato, nuts and crunchy beans.",
      my: "လက်ဖက်၊ ဂေါ်ဖီ၊ ခရမ်းချဉ်သီး၊ အစေ့အဆန်နှင့် ပဲကြော်တို့ကို သုပ်ထားသည်။",
      zh: "发酵茶叶拌卷心菜、番茄、坚果和香脆豆子。",
    },
    category: "salads",
    price: 70,
    image:
      "https://images.unsplash.com/photo-1565724213491-9f1ed5ae561f?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 6,
    name: { en: "Shan Tofu", my: "ရှမ်းတို့ဟူး", zh: "掸邦豆腐" },
    description: {
      en: "Smooth chickpea tofu served Shan-style with tangy house dressing.",
      my: "ချဉ်စပ်ဆော့စ်နှင့် ရှမ်းစတိုင် ပဲတို့ဟူးနူးနူး။",
      zh: "细腻鹰嘴豆豆腐配掸邦风味酸香酱汁。",
    },
    category: "snacks",
    price: 60,
    image:
      "https://images.unsplash.com/photo-1521633138793-76551d05e2a3?auto=format&fit=crop&w=800&q=85",
    soldOut: true,
  },
  {
    id: 7,
    name: { en: "Burmese Milk Tea", my: "လက်ဖက်ရည်", zh: "缅甸奶茶" },
    description: {
      en: "Strong black tea softened with creamy condensed milk.",
      my: "နို့ဆီချိုချိုနှင့် ဖျော်ထားသော လက်ဖက်ရည်ခပ်ပြင်းပြင်း။",
      zh: "浓郁红茶加入香甜炼乳，顺滑醇厚。",
    },
    category: "drinks",
    price: 40,
    image:
      "https://images.unsplash.com/photo-1682139710677-cb02f6bc4211?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 8,
    name: { en: "Lime Juice", my: "သံပုရာရည်", zh: "青柠汁" },
    description: {
      en: "Freshly squeezed lime, lightly sweetened and served over ice.",
      my: "လတ်ဆတ်သော သံပုရာရည်ကို အချိုအနည်းငယ်နှင့် ရေခဲထည့်ထားသည်။",
      zh: "鲜榨青柠汁，微甜加冰，清新解腻。",
    },
    category: "drinks",
    price: 45,
    image:
      "https://images.unsplash.com/photo-1655115287935-8e364d3f7af1?auto=format&fit=crop&w=800&q=85",
  },
]

const STORAGE_KEY = "linn-menu-v1"

const defaults = (): MenuState => ({
  categories: defaultCategories,
  items: defaultItems,
})

const load = (): MenuState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as MenuState
      if (Array.isArray(parsed.items) && Array.isArray(parsed.categories))
        return parsed
    }
  } catch {
    // Unreadable or blocked storage — start from the default menu.
  }
  return defaults()
}

let state: MenuState = load()
const listeners = new Set<() => void>()

const emit = () => listeners.forEach((listener) => listener())

const save = (next: MenuState) => {
  state = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage full or blocked — changes still apply until the page reloads.
  }
  emit()
}

// Keep other tabs (e.g. customer menu open next to the owner page) in sync.
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

export const useMenu = () =>
  useSyncExternalStore(subscribe, () => state, () => state)

/** Text in the chosen language, falling back to English, then any language. */
export const pick = (text: Translated, language: Language) =>
  text[language]?.trim() || text.en?.trim() || text.my?.trim() || text.zh?.trim() || ""

export const menuActions = {
  addItem(item: Omit<MenuItem, "id">) {
    const id = Math.max(0, ...state.items.map((entry) => entry.id)) + 1
    save({ ...state, items: [...state.items, { ...item, id }] })
    return id
  },
  updateItem(item: MenuItem) {
    save({
      ...state,
      items: state.items.map((entry) => (entry.id === item.id ? item : entry)),
    })
  },
  deleteItem(id: number) {
    save({ ...state, items: state.items.filter((entry) => entry.id !== id) })
  },
  setSoldOut(id: number, soldOut: boolean) {
    save({
      ...state,
      items: state.items.map((entry) =>
        entry.id === id ? { ...entry, soldOut } : entry,
      ),
    })
  },
  addCategory(name: Translated) {
    const id = `cat-${Date.now().toString(36)}`
    save({ ...state, categories: [...state.categories, { id, name }] })
    return id
  },
  reset() {
    save(defaults())
  },
}
