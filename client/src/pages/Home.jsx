import { Link } from 'react-router-dom';
import { ArrowDownToLine, ArrowUpFromLine, List } from 'lucide-react';

const actions = [
  {
    to: '/add-stock',
    label: 'ADD STOCK',
    description: 'Add a new product to your inventory.',
    icon: ArrowDownToLine,
  },
  {
    to: '/out-stock',
    label: 'OUT STOCK',
    description: 'Move items out of your stock.',
    icon: ArrowUpFromLine,
  },
  {
    to: '/stock-list',
    label: 'STOCK LIST',
    description: 'View and manage everything in stock.',
    icon: List,
  },
];

const Home = () => (
  <div className="relative overflow-hidden">
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <svg className="absolute -right-20 -top-20 h-80 w-80 text-primary/10" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="98" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg className="absolute -left-24 bottom-0 h-72 w-72 text-primary/10" viewBox="0 0 200 200" fill="none">
        <rect x="10" y="10" width="180" height="180" rx="28" stroke="currentColor" strokeWidth="1.5" />
        <rect x="32" y="32" width="136" height="136" rx="18" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>

    <div className="container-page relative py-14 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Inventory Manager
        </p>
        <h1 className="heading-display mt-4 text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
          MANAGE.
          <br />
          <span className="text-primary">TRACK.</span>
          <br />
          GROW.
        </h1>
        <p className="mt-7 max-w-md text-lg leading-relaxed text-dark-soft">
          Keep your inventory organized, track every movement, and stay in control of your stock.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:max-w-3xl lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.to}
              to={action.to}
              className="group rounded-2xl border border-line bg-white p-6 transition-colors duration-150 hover:border-primary"
            >
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white" aria-hidden="true">
                <Icon className="h-5.5 w-5.5" strokeWidth={1.8} />
              </span>
              <p className="text-base font-semibold tracking-wide text-dark">{action.label}</p>
              <p className="mt-1.5 text-sm text-dark-soft">{action.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  </div>
);

export default Home;
