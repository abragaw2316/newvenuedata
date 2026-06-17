// New Venue Data logo mark: a striped storefront awning with a small "new-opening"
// signal dot — it reads as a bar/restaurant just opening its doors, which is exactly
// what the product detects. Awning inherits currentColor; the signal dot uses the
// brand accent (the remapped indigo → ledger green).
export function LogoMark({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} role="img" aria-label="New Venue Data">
      <g fill="currentColor">
        {/* storefront header board */}
        <rect x="3.4" y="4.6" width="15.6" height="1.9" rx="0.5" />
        {/* three scalloped awning panels (the gaps read as stripes) */}
        <path d="M4.2 6.5 L4.2 10.4 Q6.3 13.7 8.4 10.4 L8.4 6.5 Z" />
        <path d="M9 6.5 L9 10.4 Q11.1 13.7 13.2 10.4 L13.2 6.5 Z" />
        <path d="M13.8 6.5 L13.8 10.4 Q15.9 13.7 18 10.4 L18 6.5 Z" />
      </g>
      {/* "new opening" signal */}
      <circle cx="19.4" cy="4.2" r="1.7" className="fill-indigo-500" />
    </svg>
  )
}
