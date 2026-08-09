import { useEffect, useRef, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Eye,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';

const ProductActionsMenu = ({ onView, onEdit, onAddStock, onOutStock, onDelete }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const items = [
    { label: 'View', icon: Eye, onClick: onView },
    { label: 'Edit', icon: Pencil, onClick: onEdit },
    { label: 'Add Stock', icon: ArrowDownToLine, onClick: onAddStock },
    { label: 'Out Stock', icon: ArrowUpFromLine, onClick: onOutStock },
    { label: 'Delete', icon: Trash2, onClick: onDelete, danger: true },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-dark-soft transition-colors hover:bg-black/5 hover:text-dark"
        aria-label="Product actions"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <MoreVertical className="h-5 w-5" aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-1 w-44 overflow-hidden rounded-xl border border-line bg-white py-1.5 shadow-card"
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  item.onClick?.();
                }}
                className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                  item.danger
                    ? 'text-[#B3573F] hover:bg-[#FBEFEB]'
                    : 'text-dark hover:bg-black/5'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductActionsMenu;
