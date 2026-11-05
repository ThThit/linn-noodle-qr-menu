import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import StartScreen from "./StartScreen"
import OwnerApp from "./owner/OwnerApp"
import StaffApp from "./staff/StaffApp"
import "./index.css"
import "./orders.css"

type View = "start" | "customer" | "staff" | "owner"

const viewFromHash = (): View => {
  switch (window.location.hash) {
    case "#customer":
      return "customer"
    case "#staff":
      return "staff"
    case "#owner":
      return "owner"
    default:
      return "start"
  }
}

function BackToStart() {
  return (
    <a className="start-back" href="#">
      ← Start screen
    </a>
  )
}

function Root() {
  const [view, setView] = useState(viewFromHash)

  useEffect(() => {
    const onHashChange = () => {
      setView(viewFromHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  if (view === "start") return <StartScreen />
  if (view === "staff") return <StaffApp />
  return (
    <>
      {view === "owner" ? <OwnerApp /> : <App />}
      <BackToStart />
    </>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
