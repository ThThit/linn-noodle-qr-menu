import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
  type ReactNode,
} from "react"
import "./menu.css"
import { menuCopy } from "./menuCopy"
import {
  menuActions,
  pick,
  placeholderImage,
  useMenu,
  type Language,
  type MenuItem,
  type Translated,
} from "../shared/menuStore"

const languages: Language[] = ["my", "en", "zh"]
const emptyText = (): Translated => ({ my: "", en: "", zh: "" })
const hasText = (text: Translated) => languages.some((lang) => text[lang].trim())

type Draft = {
  id?: number
  name: Translated
  description: Translated
  price: string
  category: string
  image: string
  soldOut: boolean
}

const icon = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)
const editIcon = icon(<><path d="M4 20h4L19 9l-4-4L4 16v4Z" /><path d="m13.5 6.5 4 4" /></>)
const trashIcon = icon(<><path d="M4 7h16M10 11v6M14 11v6" /><path d="M6 7l1 13h10l1-13M9 7V4h6v3" /></>)
const photoIcon = icon(<><rect x="3" y="5" width="18" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-8 8" /></>)
const externalIcon = icon(<><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>)

/** Shrinks an uploaded photo so it fits comfortably in browser storage. */
function readPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error("Not an image"))
      image.onload = () => {
        const max = 640
        const scale = Math.min(1, max / Math.max(image.width, image.height))
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(image.width * scale)
        canvas.height = Math.round(image.height * scale)
        const ctx = canvas.getContext("2d")
        if (!ctx) return resolve(String(reader.result))
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", 0.82))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={checked ? "toggle on" : "toggle"}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-knob" />
    </button>
  )
}

/** Shared modal shell for the small pop-ups (delete, add category). */
function Dialog({
  labelledBy,
  onClose,
  children,
}: {
  labelledBy: string
  onClose: () => void
  children: ReactNode
}) {
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && closeRef.current()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="small-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        {children}
      </section>
    </div>
  )
}

function ItemPanel({
  draft,
  setDraft,
  language,
  onSave,
  onCancel,
}: {
  draft: Draft
  setDraft: (draft: Draft) => void
  language: Language
  onSave: () => void
  onCancel: () => void
}) {
  const m = menuCopy[language]
  const { categories } = useMenu()
  const [dragging, setDragging] = useState(false)
  const [photoError, setPhotoError] = useState("")
  const [showErrors, setShowErrors] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const firstField = useRef<HTMLInputElement>(null)
  const cancelRef = useRef(onCancel)
  cancelRef.current = onCancel

  useEffect(() => {
    firstField.current?.focus()
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && cancelRef.current()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const nameMissing = !hasText(draft.name)
  const price = Number(draft.price)
  const priceMissing = !draft.price || Number.isNaN(price) || price <= 0

  const takePhoto = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setPhotoError(m.photoError)
      return
    }
    try {
      const image = await readPhoto(file)
      setPhotoError("")
      setDraft({ ...draft, image })
    } catch {
      setPhotoError(m.photoError)
    }
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    void takePhoto(event.dataTransfer.files[0])
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (nameMissing || priceMissing) {
      setShowErrors(true)
      return
    }
    onSave()
  }

  const setText = (field: "name" | "description", lang: Language, value: string) =>
    setDraft({ ...draft, [field]: { ...draft[field], [lang]: value } })

  return (
    <div
      className="panel-overlay"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onCancel()}
    >
      <form
        className="item-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-panel-title"
        onSubmit={submit}
        noValidate
      >
        <header className="item-panel-head">
          <h2 id="item-panel-title">{draft.id ? m.panelEdit : m.panelAdd}</h2>
          <button type="button" className="modal-close" aria-label={m.close} onClick={onCancel}>
            ×
          </button>
        </header>

        <div className="item-panel-body">
          {/* Photo */}
          <section className="form-section">
            <p className="form-label">{m.photo}</p>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => {
                void takePhoto(event.target.files?.[0])
                event.target.value = ""
              }}
            />
            {draft.image ? (
              <div className="photo-preview">
                <img src={draft.image} alt="" />
                <div className="photo-preview-actions">
                  <button type="button" className="secondary-button" onClick={() => fileInput.current?.click()}>
                    {photoIcon}
                    <span>{m.changePhoto}</span>
                  </button>
                  <button type="button" className="link-button" onClick={() => setDraft({ ...draft, image: "" })}>
                    {m.removePhoto}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className={dragging ? "dropzone dragging" : "dropzone"}
                onClick={() => fileInput.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
              >
                <span className="dropzone-icon">{photoIcon}</span>
                <strong>{dragging ? m.dropActive : m.dropTitle}</strong>
                <span>{m.dropOr}</span>
              </button>
            )}
            {photoError && <p className="field-error">{photoError}</p>}
          </section>

          {/* Names */}
          <fieldset className="form-section">
            <legend className="form-label">{m.itemName}</legend>
            {languages.map((lang, index) => (
              <label className="lang-field" key={lang}>
                <span className="lang-tag">{m.languageLabels[lang]}</span>
                <input
                  ref={index === 0 ? firstField : undefined}
                  lang={lang === "zh" ? "zh-Hans" : lang}
                  value={draft.name[lang]}
                  placeholder={m.namePlaceholder[lang]}
                  aria-invalid={showErrors && nameMissing}
                  onChange={(event) => setText("name", lang, event.target.value)}
                />
              </label>
            ))}
            {showErrors && nameMissing && <p className="field-error">{m.nameRequired}</p>}
          </fieldset>

          {/* Descriptions */}
          <fieldset className="form-section">
            <legend className="form-label">{m.description}</legend>
            {languages.map((lang) => (
              <label className="lang-field" key={lang}>
                <span className="lang-tag">{m.languageLabels[lang]}</span>
                <textarea
                  rows={2}
                  lang={lang === "zh" ? "zh-Hans" : lang}
                  value={draft.description[lang]}
                  placeholder={m.descPlaceholder}
                  onChange={(event) => setText("description", lang, event.target.value)}
                />
              </label>
            ))}
          </fieldset>

          {/* Price + category */}
          <section className="form-section form-row">
            <label className="plain-field">
              <span className="form-label">{m.price}</span>
              <div className="price-input">
                <span aria-hidden="true">฿</span>
                <input
                  inputMode="numeric"
                  value={draft.price}
                  placeholder="0"
                  aria-invalid={showErrors && priceMissing}
                  onChange={(event) =>
                    setDraft({ ...draft, price: event.target.value.replace(/[^\d]/g, "") })
                  }
                />
              </div>
              {showErrors && priceMissing && <p className="field-error">{m.priceRequired}</p>}
            </label>
            <label className="plain-field">
              <span className="form-label">{m.category}</span>
              <div className="select-wrap">
                <select
                  value={draft.category}
                  onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {pick(category.name, language)}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </section>

          {/* Availability */}
          <section className="form-section">
            <p className="form-label">{m.availability}</p>
            <div className={draft.soldOut ? "availability-box sold" : "availability-box"}>
              <Toggle
                checked={!draft.soldOut}
                label={m.available}
                onChange={(available) => setDraft({ ...draft, soldOut: !available })}
              />
              <div>
                <strong>{draft.soldOut ? m.soldOut : m.available}</strong>
                <span>{draft.soldOut ? m.soldOutHint : m.availableHint}</span>
              </div>
            </div>
          </section>
        </div>

        <footer className="item-panel-foot">
          <button type="button" className="secondary-button" onClick={onCancel}>
            {m.cancel}
          </button>
          <button type="submit" className="primary-button save-button">
            {m.save}
          </button>
        </footer>
      </form>
    </div>
  )
}

export default function MenuManager({ language }: { language: Language }) {
  const m = menuCopy[language]
  const { items, categories } = useMenu()
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "")
  const [draft, setDraft] = useState<Draft | null>(null)
  const [deleting, setDeleting] = useState<MenuItem | null>(null)
  const [addingCategory, setAddingCategory] = useState(false)
  const [categoryName, setCategoryName] = useState<Translated>(emptyText)
  const [toast, setToast] = useState<string | null>(null)
  const [flashId, setFlashId] = useState<number | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const currentCategory = categories.some((c) => c.id === activeCategory)
    ? activeCategory
    : (categories[0]?.id ?? "")
  const rows = items.filter((item) => item.category === currentCategory)
  const itemName = (item: { name: Translated }) => pick(item.name, language)

  const showToast = (message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }

  const flash = (id: number) => {
    setFlashId(id)
    window.setTimeout(() => setFlashId((current) => (current === id ? null : current)), 1800)
    window.setTimeout(() => {
      document.getElementById(`menu-row-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 60)
  }

  const openNew = () =>
    setDraft({
      name: emptyText(),
      description: emptyText(),
      price: "",
      category: currentCategory,
      image: "",
      soldOut: false,
    })

  const openEdit = (item: MenuItem) =>
    setDraft({
      id: item.id,
      name: { ...emptyText(), ...item.name },
      description: { ...emptyText(), ...item.description },
      price: String(item.price),
      category: item.category,
      image: item.image === placeholderImage ? "" : item.image,
      soldOut: Boolean(item.soldOut),
    })

  const saveDraft = () => {
    if (!draft) return
    const trim = (text: Translated): Translated => ({
      my: text.my.trim(),
      en: text.en.trim(),
      zh: text.zh.trim(),
    })
    const item = {
      name: trim(draft.name),
      description: trim(draft.description),
      price: Number(draft.price),
      category: draft.category,
      image: draft.image || placeholderImage,
      soldOut: draft.soldOut,
    }
    let id = draft.id
    if (id) {
      menuActions.updateItem({ ...item, id })
      showToast(m.saved(pick(item.name, language)))
    } else {
      id = menuActions.addItem(item)
      showToast(m.added(pick(item.name, language)))
    }
    setActiveCategory(item.category)
    setDraft(null)
    flash(id)
  }

  const toggleAvailable = (item: MenuItem, available: boolean) => {
    menuActions.setSoldOut(item.id, !available)
    showToast(available ? m.nowAvailable(itemName(item)) : m.nowSoldOut(itemName(item)))
  }

  const confirmDelete = () => {
    if (!deleting) return
    menuActions.deleteItem(deleting.id)
    showToast(m.deleted(itemName(deleting)))
    setDeleting(null)
  }

  const addCategory = (event: FormEvent) => {
    event.preventDefault()
    if (!hasText(categoryName)) return
    const id = menuActions.addCategory({
      my: categoryName.my.trim(),
      en: categoryName.en.trim(),
      zh: categoryName.zh.trim(),
    })
    showToast(m.categoryAdded(pick(categoryName, language)))
    setActiveCategory(id)
    setAddingCategory(false)
    setCategoryName(emptyText())
  }

  return (
    <div className="menu-page">
      <header className="menu-header">
        <div className="page-heading">
          <h1>{m.title}</h1>
          <p>{m.helper}</p>
        </div>
        <div className="menu-header-actions">
          <a className="secondary-button" href="#customer" target="_blank" rel="noreferrer">
            {externalIcon}
            <span>{m.seeCustomerMenu}</span>
          </a>
          <button type="button" className="primary-button add-item-button" onClick={openNew}>
            <span aria-hidden="true" className="plus">+</span>
            <span>{m.addItem}</span>
          </button>
        </div>
      </header>

      <nav className="menu-tabs" aria-label={m.columns.category}>
        {categories.map((category) => {
          const inCategory = items.filter((item) => item.category === category.id)
          return (
            <button
              type="button"
              key={category.id}
              className={currentCategory === category.id ? "menu-tab active" : "menu-tab"}
              aria-pressed={currentCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            >
              <span>{pick(category.name, language)}</span>
              <span className="tab-count">{inCategory.length}</span>
            </button>
          )
        })}
        <button type="button" className="menu-tab add-category" onClick={() => setAddingCategory(true)}>
          <span aria-hidden="true">+</span>
          <span>{m.addCategory}</span>
        </button>
      </nav>

      <section className="panel menu-list-panel">
        <div className="menu-list-summary">
          <strong>{m.itemsCount(rows.length)}</strong>
          {rows.some((item) => item.soldOut) && (
            <span className="sold-pill">{m.soldOutCount(rows.filter((item) => item.soldOut).length)}</span>
          )}
        </div>

        {rows.length === 0 ? (
          <div className="menu-empty">
            <p>{m.emptyCategory}</p>
            <button type="button" className="primary-button add-item-button" onClick={openNew}>
              <span aria-hidden="true" className="plus">+</span>
              <span>{m.addItem}</span>
            </button>
          </div>
        ) : (
          <div className="menu-table" role="table" aria-label={m.title}>
            <div className="menu-row menu-row-head" role="row">
              <span role="columnheader">{m.columns.photo}</span>
              <span role="columnheader">{m.columns.name}</span>
              <span role="columnheader" className="num">{m.columns.price}</span>
              <span role="columnheader">{m.columns.category}</span>
              <span role="columnheader">{m.columns.available}</span>
              <span role="columnheader" className="sr-only">{m.columns.actions}</span>
            </div>
            {rows.map((item) => {
              const others = languages
                .filter((lang) => lang !== language && item.name[lang]?.trim())
                .map((lang) => item.name[lang])
              const category = categories.find((c) => c.id === item.category)
              return (
                <div
                  key={item.id}
                  id={`menu-row-${item.id}`}
                  role="row"
                  className={[
                    "menu-row",
                    item.soldOut ? "is-sold-out" : "",
                    flashId === item.id ? "flash" : "",
                  ].filter(Boolean).join(" ")}
                >
                  <span role="cell">
                    <img className="menu-photo" src={item.image} alt="" />
                  </span>
                  <span role="cell" className="menu-name">
                    <strong>{itemName(item)}</strong>
                    {others.length > 0 && <small>{others.join(" · ")}</small>}
                  </span>
                  <span role="cell" className="num menu-price">฿{item.price}</span>
                  <span role="cell">
                    <span className="category-chip">{category ? pick(category.name, language) : "—"}</span>
                  </span>
                  <span role="cell" className="menu-available">
                    <Toggle
                      checked={!item.soldOut}
                      label={`${m.available}: ${itemName(item)}`}
                      onChange={(available) => toggleAvailable(item, available)}
                    />
                    <span className={item.soldOut ? "state sold" : "state"}>
                      {item.soldOut ? m.soldOut : m.available}
                    </span>
                  </span>
                  <span role="cell" className="menu-actions">
                    <button type="button" className="row-button" onClick={() => openEdit(item)}>
                      {editIcon}
                      <span>{m.edit}</span>
                    </button>
                    <button type="button" className="row-button danger" onClick={() => setDeleting(item)}>
                      {trashIcon}
                      <span>{m.delete}</span>
                    </button>
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {draft && (
        <ItemPanel
          draft={draft}
          setDraft={setDraft}
          language={language}
          onSave={saveDraft}
          onCancel={() => setDraft(null)}
        />
      )}

      {deleting && (
        <Dialog labelledBy="delete-title" onClose={() => setDeleting(null)}>
          <div className="delete-dialog">
            <img src={deleting.image} alt="" />
            <h2 id="delete-title">{m.deleteQuestion}</h2>
            <p className="delete-name">{itemName(deleting)}</p>
            <p className="delete-note">{m.deleteNote}</p>
            <div className="dialog-actions">
              <button type="button" className="secondary-button" onClick={() => setDeleting(null)} autoFocus>
                {m.cancel}
              </button>
              <button type="button" className="danger-button" onClick={confirmDelete}>
                {trashIcon}
                <span>{m.deleteYes}</span>
              </button>
            </div>
          </div>
        </Dialog>
      )}

      {addingCategory && (
        <Dialog labelledBy="category-title" onClose={() => setAddingCategory(false)}>
          <form className="category-dialog" onSubmit={addCategory}>
            <h2 id="category-title">{m.categoryTitle}</h2>
            <p className="dialog-helper">{m.categoryHelper}</p>
            {languages.map((lang, index) => (
              <label className="lang-field" key={lang}>
                <span className="lang-tag">{m.languageLabels[lang]}</span>
                <input
                  autoFocus={index === 1}
                  lang={lang === "zh" ? "zh-Hans" : lang}
                  value={categoryName[lang]}
                  onChange={(event) => setCategoryName({ ...categoryName, [lang]: event.target.value })}
                />
              </label>
            ))}
            <div className="dialog-actions">
              <button type="button" className="secondary-button" onClick={() => setAddingCategory(false)}>
                {m.cancel}
              </button>
              <button type="submit" className="primary-button" disabled={!hasText(categoryName)}>
                {m.categoryAdd}
              </button>
            </div>
          </form>
        </Dialog>
      )}

      {toast && (
        <div className="owner-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  )
}
