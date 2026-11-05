import { useState, type FormEvent, type ReactNode } from "react"
import "./owner.css"
import Dashboard from "./Dashboard"
import { BowlMark } from "./Logo"
import QrPage, { type QrTable } from "./QrPage"
import MenuManager from "./MenuManager"
import { formatDate, ownerCopy, type Language } from "./ownerCopy"

type Page = "dashboard" | "qr" | "menu" | "settings"

const SESSION_KEY = "linn-owner-session"
const OWNER_NAME = "Daw Linn"
const LANGUAGE_KEY = "linn-owner-language"

const readLanguage = (): Language => {
  try {
    const saved = window.localStorage.getItem(LANGUAGE_KEY)
    if (saved === "en" || saved === "my" || saved === "zh") return saved
  } catch {
    // Storage unavailable — fall back to English.
  }
  return "en"
}

function LanguageSelect({
  language,
  onChange,
}: {
  language: Language
  onChange: (language: Language) => void
}) {
  return (
    <label className="language-select">
      <span className="sr-only">{ownerCopy[language].language}</span>
      <select
        value={language}
        onChange={(event) => onChange(event.target.value as Language)}
      >
        <option value="my">မြန်မာ</option>
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>
      <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
        <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  )
}

const readSession = () => {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1"
  } catch {
    return false
  }
}

const writeSession = (loggedIn: boolean) => {
  try {
    if (loggedIn) window.sessionStorage.setItem(SESSION_KEY, "1")
    else window.sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // Storage unavailable — the login just won't survive a refresh.
  }
}

const icon = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
)

const navItems: { page: Page; icon: ReactNode }[] = [
  {
    page: "dashboard",
    icon: icon(<><rect x="3.5" y="3.5" width="7" height="8" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="5" rx="1.5" /><rect x="13.5" y="11.5" width="7" height="9" rx="1.5" /><rect x="3.5" y="14.5" width="7" height="6" rx="1.5" /></>),
  },
  {
    page: "qr",
    icon: icon(<><rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1" /><rect x="14" y="3.5" width="6.5" height="6.5" rx="1" /><rect x="3.5" y="14" width="6.5" height="6.5" rx="1" /><path d="M14 14h2.5v2.5H14zM18 18h2.5v2.5H18zM14 20.5h2M20.5 14v2" /></>),
  },
  {
    page: "menu",
    icon: icon(<><path d="M4 6h16M4 12h16M4 18h10" /></>),
  },
  {
    page: "settings",
    icon: icon(<><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3h-4.4l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2l.4 2.6h4.4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" /></>),
  },
]

const logoutIcon = icon(<><path d="M15 4h3.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H15" /><path d="M10 16.5 5.5 12 10 7.5M5.5 12H15" /></>)

function LoginScreen({
  onLogin,
  language,
  onLanguage,
}: {
  onLogin: () => void
  language: Language
  onLanguage: (language: Language) => void
}) {
  const t = ownerCopy[language]
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!username.trim() || !password) {
      setError(t.loginError)
      return
    }
    setError("")
    onLogin()
  }

  return (
    <div className="login-page" lang={language === "zh" ? "zh-Hans" : language}>
      <div className="login-language">
        <LanguageSelect language={language} onChange={onLanguage} />
      </div>
      <form className="login-card" onSubmit={submit} noValidate>
        <BowlMark large />
        <h1>Linn Noodle</h1>
        <p className="login-sub">{t.signIn}</p>

        <label className="field">
          <span>{t.username}</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            placeholder={t.usernamePlaceholder}
            autoFocus
          />
        </label>

        <label className="field">
          <span>{t.password}</span>
          <div className="password-wrap">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder={t.passwordPlaceholder}
            />
            <button
              type="button"
              className="show-password"
              onClick={() => setShowPassword((shown) => !shown)}
            >
              {showPassword ? t.hide : t.show}
            </button>
          </div>
        </label>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="primary-button login-button">
          {t.logIn}
        </button>
        <p className="login-hint">{t.demoHint}</p>
      </form>
    </div>
  )
}

function ComingSoon({ title, note }: { title: string; note: string }) {
  return (
    <div className="coming-soon">
      <h1>{title}</h1>
      <p>{note}</p>
    </div>
  )
}

export default function OwnerApp() {
  const [loggedIn, setLoggedIn] = useState(readSession)
  const [page, setPage] = useState<Page>("dashboard")
  const [language, setLanguage] = useState<Language>(readLanguage)
  const [qrTables, setQrTables] = useState<QrTable[] | null>(null)
  const t = ownerCopy[language]

  const changeLanguage = (next: Language) => {
    setLanguage(next)
    try {
      window.localStorage.setItem(LANGUAGE_KEY, next)
    } catch {
      // Ignore — the choice just won't be remembered.
    }
  }

  const logIn = () => {
    writeSession(true)
    setPage("dashboard")
    setLoggedIn(true)
  }

  const logOut = () => {
    writeSession(false)
    setLoggedIn(false)
  }

  if (!loggedIn)
    return (
      <LoginScreen
        onLogin={logIn}
        language={language}
        onLanguage={changeLanguage}
      />
    )

  const today = formatDate(new Date(), language, "full")

  return (
    <div className="owner-shell" lang={language === "zh" ? "zh-Hans" : language}>
      <aside className="owner-sidebar">
        <div className="sidebar-brand">
          <BowlMark />
          <div>
            <p className="brand-name">Linn Noodle</p>
            <p className="sidebar-role">{t.role}</p>
          </div>
        </div>
        <nav className="sidebar-nav" aria-label="Owner pages">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.page}
              className={page === item.page ? "nav-item active" : "nav-item"}
              aria-current={page === item.page ? "page" : undefined}
              onClick={() => setPage(item.page)}
            >
              {item.icon}
              <span>{t.nav[item.page]}</span>
            </button>
          ))}
        </nav>
        <button type="button" className="nav-item logout" onClick={logOut}>
          {logoutIcon}
          <span>{t.logOut}</span>
        </button>
      </aside>

      <div className="owner-main">
        <header className="owner-topbar">
          <p className="owner-title">{t.title}</p>
          <div className="owner-topbar-right">
            <LanguageSelect language={language} onChange={changeLanguage} />
            <p className="owner-date">{today}</p>
            <div className="owner-profile">
              <span className="avatar" aria-hidden="true">
                {OWNER_NAME.split(" ").map((part) => part[0]).join("")}
              </span>
              <span>{OWNER_NAME}</span>
            </div>
          </div>
        </header>
        <main className="owner-content">
          {page === "dashboard" ? (
            <Dashboard language={language} />
          ) : page === "menu" ? (
            <MenuManager language={language} />
          ) : page === "qr" ? (
            <QrPage
              language={language}
              tables={qrTables}
              setTables={setQrTables}
            />
          ) : (
            <ComingSoon title={t.nav[page]} note={t.comingSoon} />
          )}
        </main>
      </div>
    </div>
  )
}
