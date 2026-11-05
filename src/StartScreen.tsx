import { useState, type ReactNode } from "react"
import "./start.css"
import { BowlMark } from "./owner/Logo"
import { menuActions, type Language } from "./shared/menuStore"
import { orderActions } from "./shared/orderStore"

const LANGUAGE_KEY = "linn-start-language"

const readLanguage = (): Language => {
  try {
    const saved = window.localStorage.getItem(LANGUAGE_KEY)
    if (saved === "en" || saved === "my" || saved === "zh") return saved
  } catch {
    // Storage unavailable — fall back to English.
  }
  return "en"
}

const copy = {
  en: {
    subtitle: "QR ordering prototype",
    intro: "Choose which part of the system you want to open.",
    customer: "Customer View",
    customerText: "The menu guests open by scanning the table QR code.",
    customerDevice: "Phone",
    staff: "Staff View",
    staffText: "Order queue for the kitchen and cashier.",
    staffDevice: "Tablet",
    owner: "Owner View",
    ownerText: "Sales dashboard, table QR codes and menu manager.",
    ownerDevice: "Computer",
    open: "Open",
    tip: "Tip: open Customer View and Staff View in two browser tabs side by side. Orders, status changes and payments update live in both.",
    reset: "Reset demo (menu & orders)",
    resetConfirm: "Put the menu and orders back to the starting sample data? Your changes will be lost.",
    resetDone: "Menu and orders reset.",
  },
  my: {
    subtitle: "QR ဖြင့် အော်ဒါမှာသည့် စနစ် နမူနာ",
    intro: "ဖွင့်လိုသော အပိုင်းကို ရွေးပါ။",
    customer: "ဖောက်သည် မြင်ကွင်း",
    customerText: "စားပွဲ QR ကုဒ်ကို စကင်ဖတ်ပြီး ဖွင့်သော မီနူး။",
    customerDevice: "ဖုန်း",
    staff: "ဝန်ထမ်း မြင်ကွင်း",
    staffText: "မီးဖိုချောင်နှင့် ငွေကိုင်အတွက် အော်ဒါစာရင်း။",
    staffDevice: "တက်ဘလက်",
    owner: "ပိုင်ရှင် မြင်ကွင်း",
    ownerText: "အရောင်း အနှစ်ချုပ်၊ စားပွဲ QR ကုဒ်နှင့် မီနူး စီမံခြင်း။",
    ownerDevice: "ကွန်ပျူတာ",
    open: "ဖွင့်မည်",
    tip: "အကြံပြုချက်: ဖောက်သည် မြင်ကွင်းနှင့် ဝန်ထမ်း မြင်ကွင်းကို browser tab နှစ်ခုတွင် ဘေးချင်းကပ် ဖွင့်ပါ။ အော်ဒါ၊ အခြေအနေ နှင့် ငွေရှင်းမှုများ နှစ်ဖက်စလုံးတွင် ချက်ချင်း ပြောင်းပါမည်။",
    reset: "နမူနာ ဒေတာ ပြန်စရန် (မီနူးနှင့် အော်ဒါ)",
    resetConfirm: "မီနူးနှင့် အော်ဒါများကို မူလ နမူနာအတိုင်း ပြန်ထားမလား? ပြင်ဆင်ထားသမျှ ပျောက်သွားပါမည်။",
    resetDone: "မီနူးနှင့် အော်ဒါများကို ပြန်စပြီးပါပြီ။",
  },
  zh: {
    subtitle: "扫码点餐原型",
    intro: "请选择要打开的部分。",
    customer: "顾客端",
    customerText: "顾客扫描餐桌二维码后打开的菜单。",
    customerDevice: "手机",
    staff: "员工端",
    staffText: "厨房和收银使用的订单队列。",
    staffDevice: "平板",
    owner: "店主端",
    ownerText: "销售概览、餐桌二维码和菜单管理。",
    ownerDevice: "电脑",
    open: "打开",
    tip: "提示：在两个浏览器标签页中并排打开顾客端和员工端，订单、状态和结账会在两边实时更新。",
    reset: "重置演示数据（菜单和订单）",
    resetConfirm: "要把菜单和订单恢复为初始示例数据吗？您的修改将会丢失。",
    resetDone: "菜单和订单已重置。",
  },
}

const icon = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

const views = [
  {
    hash: "#customer",
    key: "customer",
    icon: icon(<><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M10.5 18.5h3" /></>),
  },
  {
    hash: "#staff",
    key: "staff",
    icon: icon(<><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M7 9.5h4M7 13h7M15.5 9.5h1.5" /></>),
  },
  {
    hash: "#owner",
    key: "owner",
    icon: icon(<><rect x="2.5" y="3.5" width="19" height="13" rx="2" /><path d="M8 20.5h8M12 16.5v4M6.5 12.5l3-3 2.5 2 4.5-4.5" /></>),
  },
] as const

export default function StartScreen() {
  const [language, setLanguage] = useState<Language>(readLanguage)
  const [notice, setNotice] = useState("")
  const t = copy[language]

  const changeLanguage = (next: Language) => {
    setLanguage(next)
    try {
      window.localStorage.setItem(LANGUAGE_KEY, next)
    } catch {
      // Ignore — the choice just won't be remembered.
    }
  }

  const reset = () => {
    if (!window.confirm(t.resetConfirm)) return
    menuActions.reset()
    orderActions.reset()
    setNotice(t.resetDone)
  }

  return (
    <div className="start-page" lang={language === "zh" ? "zh-Hans" : language}>
      <div className="start-language">
        <label className="language-select">
          <span className="sr-only">Language</span>
          <select
            value={language}
            onChange={(event) => changeLanguage(event.target.value as Language)}
          >
            <option value="my">မြန်မာ</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
          <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
            <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </label>
      </div>

      <main className="start-main">
        <BowlMark large />
        <h1>Linn Noodle</h1>
        <p className="start-subtitle">{t.subtitle}</p>
        <p className="start-intro">{t.intro}</p>

        <div className="start-options">
          {views.map((view) => (
            <a key={view.key} className={`start-option option-${view.key}`} href={view.hash}>
              <span className="start-icon">{view.icon}</span>
              <span className="start-device">{t[`${view.key}Device`]}</span>
              <strong>{t[view.key]}</strong>
              <span className="start-text">{t[`${view.key}Text`]}</span>
              <span className="start-open">
                {t.open} <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>

        <p className="start-tip">💡 {t.tip}</p>
        <div className="start-footer">
          <button type="button" className="start-reset" onClick={reset}>
            {t.reset}
          </button>
          {notice && (
            <span className="start-notice" role="status">
              {notice}
            </span>
          )}
        </div>
      </main>
    </div>
  )
}
