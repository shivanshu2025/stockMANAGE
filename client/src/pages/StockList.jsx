import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FilterButtons from '../components/FilterButtons';
import Button from '../components/Button';
import ProductTable from '../components/ProductTable';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import AddStockModal from '../components/AddStockModal';
import OutStockModal from '../components/OutStockModal';
import ProductFormModal from '../components/ProductFormModal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import Select from '../components/Select';
import useProducts from '../hooks/useProducts';
import { productApi, getErrorMessage } from '../services/api';

const PAGE_SIZE = 10;

const SummaryItem = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
    <p className="mt-1 font-display text-2xl font-semibold text-slate-800">{value}</p>
  </div>
);

const StockList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('');
  const { products, summary, loading, error, reload } = useProducts({ search, status, sort });

  const [addProduct, setAddProduct] = useState(null);
  const [outProduct, setOutProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const [page, setPage] = useState(1);
  const [goPage, setGoPage] = useState('1');

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const pageProducts = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [search, status, sort]);

  useEffect(() => {
    setGoPage(String(currentPage));
  }, [currentPage]);

  const applyGoPage = () => {
    const n = parseInt(goPage, 10);
    if (!Number.isNaN(n) && n >= 1) setPage(Math.min(n, totalPages));
    setGoPage(String(currentPage));
  };

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
  const closeToast = useCallback(() => setToast({ message: '', type: 'success' }), []);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await productApi.deleteProduct(deleteProduct._id);
      setDeleteProduct(null);
      reload();
      showToast('Product deleted successfully.');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not delete product'), 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const emptyAction = (
    <Button onClick={() => navigate('/add-stock')}>ADD STOCK</Button>
  );

  const pageItems = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  for (let i = startPage; i <= endPage; i += 1) pageItems.push(i);

  return (
    <div className="min-h-screen bg-canvas">
      <div className="container-page px-4 pt-8 pb-28 sm:px-8 sm:pt-10 sm:pb-16 md:pb-12">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Inventory</p>
          <h1 className="heading-display mt-2 text-3xl sm:text-5xl">
            STOCK. <span className="text-primary">LIST.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
            View and manage everything currently in your inventory.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:max-w-md sm:gap-3 lg:grid-cols-4 lg:max-w-none">
          <SummaryItem label="Total Products" value={summary?.total ?? '-'} />
          <SummaryItem label="In Stock" value={summary?.inStock ?? '-'} />
          <SummaryItem label="Low Stock" value={summary?.lowStock ?? '-'} />
          <SummaryItem label="Out of Stock" value={summary?.outOfStock ?? '-'} />
        </div>

        <div className="mt-6 flex w-full max-w-3xl flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search products..."
              className="w-full sm:min-w-0 sm:flex-1"
            />

            <div className="w-full sm:w-44 sm:shrink-0">
              <Select
                id="stock-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
                className="!h-10 !rounded-md !border-primary/60 !font-sans !text-sm !font-medium !leading-4 !text-dark focus:!border-primary focus:!shadow-[0_0_0_3px_rgba(119,134,103,0.2)]"
              >
                <option value="">Newest</option>
                <option value="name">Name A-Z</option>
                <option value="quantity-asc">Quantity: Low to High</option>
              </Select>
            </div>
          </div>

          <div className="w-full">
            <FilterButtons
              value={status}
              onChange={setStatus}
              className="w-full [&>button]:min-w-[calc(50%-0.25rem)] [&>button]:flex-1 sm:w-auto sm:[&>button]:min-w-0 sm:[&>button]:flex-none"
            />
          </div>
        </div>

        <div className="mt-8">
          {error && <ErrorMessage message={error} />}

          {loading ? (
            <p className="py-16 text-center text-sm text-slate-500">Loading products...</p>
          ) : products.length === 0 ? (
            search.trim() || status !== 'all' ? (
              <EmptyState
                title="No products found"
                description="Try changing your search or filter."
                action={<Button variant="secondary" onClick={() => { setSearch(''); setStatus('all'); }}>CLEAR FILTERS</Button>}
              />
            ) : (
              <EmptyState
                title="No products yet."
                description="Add your first product to start tracking your stock."
                action={emptyAction}
              />
            )
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] lg:hidden">
                {pageProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onEdit={setEditProduct}
                    onAddStock={setAddProduct}
                    onOutStock={setOutProduct}
                    onDelete={setDeleteProduct}
                  />
                ))}
              </div>

              <div className="hidden w-full lg:block">
                <div className="rounded-lg border border-slate-200 bg-white shadow-sm [&_tbody_tr:hover]:bg-slate-50">
                  <ProductTable
                    products={pageProducts}
                    onEdit={setEditProduct}
                    onAddStock={setAddProduct}
                    onOutStock={setOutProduct}
                    onDelete={setDeleteProduct}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-end sm:gap-4">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>

                  {pageItems.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPage(item)}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                        item === currentPage
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
                      }`}
                      aria-current={item === currentPage ? 'page' : undefined}
                    >
                      {item}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Go to page</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={goPage}
                    onChange={(e) => setGoPage(e.target.value.replace(/[^0-9]/g, ''))}
                    onBlur={applyGoPage}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') applyGoPage();
                    }}
                    className="h-9 w-20 rounded-md border border-slate-200 px-2 text-sm text-slate-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    aria-label="Go to page"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <AddStockModal
          open={Boolean(addProduct)}
          onClose={() => setAddProduct(null)}
          product={addProduct}
          onSuccess={() => {
            reload();
            showToast('Stock updated successfully.');
          }}
        />
        <OutStockModal
          open={Boolean(outProduct)}
          onClose={() => setOutProduct(null)}
          product={outProduct}
          onSuccess={() => {
            reload();
            showToast('Stock updated successfully.');
          }}
        />
        <ProductFormModal
          open={Boolean(editProduct)}
          onClose={() => setEditProduct(null)}
          product={editProduct}
          onSuccess={() => {
            reload();
            showToast('Product updated successfully.');
          }}
        />
        <ConfirmModal
          open={Boolean(deleteProduct)}
          onClose={() => setDeleteProduct(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
          title="Delete this product?"
          message={`"${deleteProduct?.name}" and its stock history will be permanently removed.`}
          confirmLabel="DELETE"
        />
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      </div>
    </div>
  );
};

export default StockList;
