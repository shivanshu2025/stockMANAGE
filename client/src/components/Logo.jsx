import { Link } from 'react-router-dom';

const Logo = ({ to = '/home', light = false }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-2.5"
    aria-label="Stock home"
  >
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5 text-canvas">
        <path
          d="M5 5v14h14"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="19" cy="5" r="2" fill="currentColor" />
      </svg>
    </span>
    <span className={`font-display text-lg font-semibold tracking-tight ${light ? 'text-white' : 'text-dark'}`}>
      Stock
    </span>
  </Link>
);

export default Logo;
