import ProductRow from './ProductRow';

const ProductTable = ({ products, onEdit, onAddStock, onOutStock, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[760px] border-collapse text-left">
      <thead>
        <tr className="border-b border-line text-[11px] uppercase tracking-wider text-dark-muted">
          <th className="px-5 py-3.5 font-medium">Product</th>
          <th className="px-5 py-3.5 font-medium">Type</th>
          <th className="px-5 py-3.5 font-medium">Size</th>
          <th className="px-5 py-3.5 font-medium">Quantity</th>
          <th className="px-5 py-3.5 font-medium">Status</th>
          <th className="px-5 py-3.5 font-medium">Note</th>
          <th className="px-5 py-3.5 text-right font-medium">Action</th>
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
  </div>
);

export default ProductTable;
