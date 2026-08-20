import ProductRow from './ProductRow';

const ProductTable = ({ products, onEdit, onAddStock, onOutStock, onDelete }) => (
  <table className="w-full border-collapse text-left">
    <thead>
      <tr className="border-b border-line text-[11px] uppercase tracking-wider text-dark-muted">
        <th className="rounded-tl-lg bg-slate-50 px-4 py-2.5 font-medium">Product</th>
        <th className="bg-slate-50 px-4 py-2.5 font-medium">Type</th>
        <th className="bg-slate-50 px-4 py-2.5 font-medium">Size</th>
        <th className="bg-slate-50 px-4 py-2.5 font-medium">Quantity</th>
        <th className="bg-slate-50 px-4 py-2.5 font-medium">Status</th>
        <th className="bg-slate-50 px-4 py-2.5 font-medium">Note</th>
        <th className="rounded-tr-lg bg-slate-50 px-4 py-2.5 text-right font-medium">Action</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product) => (
        <ProductRow
          key={product._id}
          product={product}
          onEdit={onEdit}
          onAddStock={onAddStock}
          onOutStock={onOutStock}
          onDelete={onDelete}
        />
      ))}
    </tbody>
  </table>
);

export default ProductTable;