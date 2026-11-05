export function BowlMark({ large = false }: { large?: boolean }) {
  return (
    <div
      className={large ? "logo-mark logo-large" : "logo-mark"}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 32 32"
        className={large ? "size-11" : "size-7"}
        fill="none"
      >
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
