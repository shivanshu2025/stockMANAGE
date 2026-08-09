import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

const SummaryItem = ({ label, value }) => (
  <div className="rounded-2xl border border-line bg-white px-4 py-3.5 sm:px-5">
    <p className="text-[11px] font-medium uppercase tracking-wider text-dark-muted">{label}</p>
    <p className="mt-1 font-display text-2xl font-semibold text-dark">{value}</p>
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

  return (
    <div className="container-page py-10 sm:py-14">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Inventory</p>
      <h1 className="heading-display mt-2 text-4xl sm:text-6xl">
        STOCK.
        <br />
        <span className="text-primary">LIST.</span>
      </h1>
      <p className="mt-4 max-w-md text-dark-soft">
        View and manage everything currently in your inventory.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md lg:grid-cols-4 lg:max-w-none">
        <SummaryItem label="Total Products" value={summary?.total ?? '—'} />
        <SummaryItem label="In Stock" value={summary?.inStock ?? '—'} />
        <SummaryItem label="Low Stock" value={summary?.lowStock ?? '—'} />
        <SummaryItem label="Out of Stock" value={summary?.outOfStock ?? '—'} />
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search products..."
          className="w-full lg:max-w-sm"
        />
        <div className="w-full lg:w-48">
          <Select
            id="stock-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
            className="!h-11"
          >
            <option value="">Sort: Newest</option>
            <option value="name">Sort: Name A–Z</option>
            <option value="quantity-asc">Sort: Quantity (low)</option>
            <option value="quantity-desc">Sort: Quantity (high)</option>
          </Select>
        </div>
      </div>

      <FilterButtons value={status} onChange={setStatus} className="mt-4" />

      <div className="mt-8">
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <p className="py-16 text-center text-sm text-dark-muted">Loading products...</p>
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
            <div className="hidden overflow-hidden rounded-2xl border border-line bg-white md:block">
              <ProductTable
                products={products}
                onEdit={setEditProduct}
                onAddStock={setAddProduct}
                onOutStock={setOutProduct}
                onDelete={setDeleteProduct}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:hidden">
              {products.map((product) => (
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
  );
};

export default StockList;
