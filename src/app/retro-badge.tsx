export default function RetroBadge() {
  return <svg className="retro-badge" viewBox="0 0 320 240" role="img" aria-label="A&D Arcade, two player energy">
    <g fill="none" stroke="#f5b800" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 168C30 70 120 22 198 30c32 3 56 16 70 32" />
      <path d="m262 56 14 33 36 3-28 22 9 35-31-20-31 20 9-35-28-22 36-3Z" />
      <path d="M24 196h262" />
    </g>
    <text className="badge-script" x="44" y="168" fill="#f5b800">A&amp;D</text>
    <text className="badge-label" x="155" y="230" textAnchor="middle" fill="#5bd25b">TWO PLAYER ENERGY</text>
  </svg>;
}
