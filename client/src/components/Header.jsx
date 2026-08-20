
import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LogOut,
  ChevronDown,
  Home,
  PackagePlus,
  PackageMinus,
  ClipboardList,
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';

const NAV_ITEMS = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/add-stock', label: 'Add Stock', icon: PackagePlus },
  { to: '/out-stock', label: 'Out Stock', icon: PackageMinus },
  { to: '/stock-list', label: 'Stock List', icon: ClipboardList },
];

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!profileOpen) return;

    const handleClick = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };

    const handleKey = (e) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [profileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <div className="container-page pt-3 sm:pt-4">
        <nav
          className="relative flex items-center justify-between gap-2 pb-2 pl-2.5 pr-2 pt-3 sm:gap-3 sm:pl-4 sm:pr-3"
          aria-label="Main navigation"
        >
          <Logo />

          <ul className="hidden items-center gap-0.5 md:flex md:gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/home'}
                    className="group relative flex flex-col items-center rounded-2xl px-2 py-1.5 text-dark-muted outline-none transition-all duration-300 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 md:px-2.5 lg:px-3"
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ease-out md:h-10 md:w-10 ${
                            isActive
                              ? '-translate-y-5 bg-primary text-white shadow-[0_6px_18px_rgba(94,107,82,0.45)]'
                              : 'text-current group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:bg-primary/10'
                          }`}
                        >
                          <Icon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>

                        <span
                          className={`mt-0.5 text-[11px] font-medium tracking-wide transition-colors duration-300 ${
                            isActive
                              ? 'text-primary-dark'
                              : 'text-dark-muted group-hover:text-primary'
                          }`}
                        >
                          {item.label}
                        </span>

                        <span
                          className={`pointer-events-none absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ease-out ${
                            isActive
                              ? 'scale-100 opacity-100'
                              : 'scale-0 opacity-0'
                          }`}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <span
            className="hidden h-8 w-px bg-line md:block"
            aria-hidden="true"
          />

          <div className="relative shrink-0" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-transparent py-1 pl-1 pr-2 outline-none transition-all duration-300 ease-out hover:border-primary/30 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary/60 sm:pr-2.5"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              aria-label="Open profile menu"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-all duration-300 ease-out md:h-10 md:w-10 ${
                  profileOpen
                    ? 'scale-95 shadow-[0_4px_12px_rgba(94,107,82,0.35)]'
                    : ''
                }`}
                aria-hidden="true"
              >
                {getInitials(user?.name)}
              </span>

              <span className="hidden max-w-[10rem] truncate text-sm font-medium text-dark lg:block">
                {user?.name}
              </span>

              <ChevronDown
                className={`h-4 w-4 text-dark-soft transition-transform duration-300 ${
                  profileOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-60 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-white py-2 shadow-[0_12px_32px_rgba(67,77,89,0.12)]">
                <div className="border-b border-line px-4 py-2.5">
                  <p className="truncate text-sm font-semibold text-dark">
                    {user?.name}
                  </p>

                  <p className="truncate text-xs text-dark-muted">
                    {user?.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-dark transition-colors duration-200 hover:bg-black/5"
                >
                  <LogOut
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 bg-canvas pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Mobile navigation"
      >
        <div className="grid w-full grid-cols-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/home'}
                className="group relative flex flex-col items-center rounded-2xl px-0.5 pb-2 pt-3 text-dark-muted outline-none transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ease-out ${
                        isActive
                          ? '-translate-y-4 bg-primary text-white shadow-[0_6px_18px_rgba(94,107,82,0.45)]'
                          : 'text-current group-hover:bg-primary/10 group-active:scale-95'
                      }`}
                    >
                      <Icon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>

                    <span
                      className={`mt-0.5 text-[11px] font-medium tracking-wide transition-colors duration-300 ${
                        isActive
                          ? 'text-primary-dark'
                          : 'text-dark-muted group-hover:text-primary'
                      }`}
                    >
                      {item.label}
                    </span>

                    <span
                      className={`pointer-events-none absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ease-out ${
                        isActive
                          ? 'scale-100 opacity-100'
                          : 'scale-0 opacity-0'
                      }`}
                      aria-hidden="true"
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Header;
