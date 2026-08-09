import Logo from './Logo';

const AuthSidebar = ({ title, subtitle }) => (
  <div className="relative hidden flex-col justify-between overflow-hidden bg-dark p-12 lg:flex">
    <div className="relative z-10">
      <Logo light />
    </div>

    <div className="relative z-10 max-w-md">
      <h1 className="font-display text-5xl font-semibold leading-tight tracking-tight text-white">
        {title}
      </h1>
      {subtitle && <p className="mt-5 text-lg leading-relaxed text-white/70">{subtitle}</p>}
    </div>

    <p className="relative z-10 text-sm text-white/40">
      Inventory Management · Built for clarity
    </p>

    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <svg className="absolute -right-24 -top-24 h-72 w-72 text-primary/60" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="98" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="72" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute -bottom-32 -left-24 h-80 w-80 text-primary/40" viewBox="0 0 200 200" fill="none">
        <rect x="10" y="10" width="180" height="180" rx="24" stroke="currentColor" strokeWidth="1" />
        <rect x="30" y="30" width="140" height="140" rx="16" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute left-16 top-1/3 text-white/15" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 2v20M2 12h20" strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

export default AuthSidebar;
