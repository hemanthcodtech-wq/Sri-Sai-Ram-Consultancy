import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Boxes,
  Download,
  Edit3,
  History,
  Package,
  Plus,
  Printer,
  Search,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';

const today = new Date().toISOString().slice(0, 10);

const emptyProduct = {
  name: '',
  partNumber: '',
  category: 'Spare Part',
  brand: '',
  unit: 'Piece',
  supplier: '',
  purchaseDate: today,
  quantityReceived: '',
  unitCost: '',
  notes: '',
};

const emptyUsage = {
  productId: '',
  vehicleNumber: '',
  quantity: '',
  usedDate: today,
  odometer: '',
  remarks: '',
};

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-');
const getStock = (product) => Math.max(0, Number(product.quantityReceived || 0) - Number(product.quantityUsed || 0));

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingUsage, setEditingUsage] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [usageForm, setUsageForm] = useState(emptyUsage);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/products', { params: { search, category: categoryFilter } });
      setProducts(response.data.success ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching product records:', error);
      alert('Failed to load product records.');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 0);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/vehicles');
        const data = response.data.success ? response.data.data : response.data;
        setVehicles(data.filter((vehicle) => vehicle.status === 'Active'));
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicles();
  }, []);

  const categories = useMemo(() => ['All', ...new Set(products.map((product) => product.category).filter(Boolean))], [products]);
  const usageRows = useMemo(() => products.flatMap((product) => (product.usageRecords || []).map((usage) => ({ ...usage, productId: product._id, productName: product.name, partNumber: product.partNumber, unit: product.unit }))), [products]);
  const totalReceived = products.reduce((sum, product) => sum + Number(product.quantityReceived || 0), 0);
  const totalUsed = products.reduce((sum, product) => sum + Number(product.quantityUsed || 0), 0);
  const totalStock = products.reduce((sum, product) => sum + getStock(product), 0);
  const stockValue = products.reduce((sum, product) => sum + getStock(product) * Number(product.unitCost || 0), 0);
  const lowStockProducts = products.filter((product) => getStock(product) <= 2);

  const openProductModal = (product = null) => {
    setEditingProduct(product);
    setProductForm(product ? {
      name: product.name || '',
      partNumber: product.partNumber || '',
      category: product.category || 'Spare Part',
      brand: product.brand || '',
      unit: product.unit || 'Piece',
      supplier: product.supplier || '',
      purchaseDate: new Date(product.purchaseDate).toISOString().slice(0, 10),
      quantityReceived: product.quantityReceived ?? '',
      unitCost: product.unitCost ?? '',
      notes: product.notes || '',
    } : emptyProduct);
    setModal('product');
  };

  const openUsageModal = (product = null, usage = null) => {
    setEditingUsage(usage ? { productId: product._id, usageId: usage._id } : null);
    setUsageForm(usage ? {
      productId: product._id,
      vehicleNumber: usage.vehicleNumber || '',
      quantity: usage.quantity ?? '',
      usedDate: new Date(usage.usedDate).toISOString().slice(0, 10),
      odometer: usage.odometer ?? '',
      remarks: usage.remarks || '',
    } : { ...emptyUsage, productId: product?._id || '' });
    setModal('usage');
  };

  const handleProductSave = async (event) => {
    event.preventDefault();
    try {
      if (editingProduct) await api.put(`/products/${editingProduct._id}`, productForm);
      else await api.post('/products', productForm);
      setModal(null);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product record.');
    }
  };

  const handleUsageSave = async (event) => {
    event.preventDefault();
    try {
      if (editingUsage) {
        await api.put(`/products/${editingUsage.productId}/usage/${editingUsage.usageId}`, usageForm);
      } else {
        await api.post(`/products/${usageForm.productId}/usage`, usageForm);
      }
      setModal(null);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product usage.');
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Delete product record for "${product.name}"?`)) return;
    try {
      await api.delete(`/products/${product._id}`);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete product record.');
    }
  };

  const handleDeleteUsage = async (row) => {
    if (!window.confirm(`Delete this ${row.productName} usage record?`)) return;
    try {
      await api.delete(`/products/${row.productId}/usage/${row._id}`);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete product usage.');
    }
  };

  const exportExcel = () => {
    if (!products.length) {
      alert('No product records to export.');
      return;
    }
    const inventory = products.map((product) => ({
      'Product Name': product.name,
      'Part Number': product.partNumber || '-',
      Category: product.category,
      Brand: product.brand || '-',
      Supplier: product.supplier || '-',
      Unit: product.unit,
      'Purchase Date': formatDate(product.purchaseDate),
      'Received Qty': product.quantityReceived,
      'Used Qty': product.quantityUsed,
      'Current Stock': getStock(product),
      'Unit Cost': product.unitCost || 0,
      'Stock Value': getStock(product) * Number(product.unitCost || 0),
    }));
    const usage = usageRows.map((row) => ({
      'Product Name': row.productName,
      'Part Number': row.partNumber || '-',
      'Vehicle Number': row.vehicleNumber,
      Quantity: row.quantity,
      Unit: row.unit,
      'Used Date': formatDate(row.usedDate),
      Odometer: row.odometer || 0,
      Remarks: row.remarks || '-',
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(inventory), 'Inventory');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(usage), 'Vehicle Usage');
    XLSX.writeFile(workbook, `SSRC_Product_Management_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <>
      <SEOHead title="Product Management - SSRC Admin" noindex={true} />
      <style>{`@media print { body { background: white !important; } body * { visibility: hidden; } .no-print { display: none !important; } .print-area, .print-area * { visibility: visible; } .print-area { position: absolute; left: 0; top: 0; width: 100%; display: block !important; padding: 0 !important; } .print-area table { font-size: 10px; } .print-area section { break-inside: avoid; } }`}</style>
      <div className="space-y-5 print-area">
        <div className="no-print flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"><Package className="h-7 w-7 text-amber-600" /> Product &amp; Spare Parts</h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">Receive products, track stock, and record spare parts used on vehicles.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportExcel} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 shadow-sm"><Download className="h-4 w-4 text-emerald-600" /> Export Excel</button>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 shadow-sm"><Printer className="h-4 w-4 text-slate-500" /> Print</button>
            <button onClick={() => openProductModal()} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-sm"><Plus className="h-4 w-4" /> Receive Product</button>
          </div>
        </div>

        <div className="hidden print:block mb-6 border-b-2 border-amber-500 pb-3"><h1 className="text-2xl font-black">SSRC Product &amp; Spare Parts Report</h1><p className="text-xs text-slate-500">Generated {formatDate(new Date())}</p></div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="text-[10px] font-bold uppercase text-slate-400">Products</span><p className="mt-1 text-2xl font-black text-slate-900">{products.length}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="text-[10px] font-bold uppercase text-slate-400">Received</span><p className="mt-1 text-2xl font-black text-slate-900">{totalReceived}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="text-[10px] font-bold uppercase text-slate-400">Used</span><p className="mt-1 text-2xl font-black text-amber-700">{totalUsed}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="text-[10px] font-bold uppercase text-slate-400">Stock Value</span><p className="mt-1 text-xl font-black text-emerald-700">₹{stockValue.toLocaleString('en-IN')}</p></div>
        </div>

        <div className="no-print rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
            <div className="relative"><Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search product, part number, brand, supplier" className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" /></div>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">{categories.map((category) => <option key={category} value={category}>{category === 'All' ? 'All Categories' : category}</option>)}</select>
          </div>
        </div>

        {lowStockProducts.length > 0 && <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" /><div><strong>Low stock attention:</strong> {lowStockProducts.length} product{lowStockProducts.length === 1 ? '' : 's'} have 2 or fewer units remaining.</div></div>}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-base font-black text-slate-900"><Boxes className="h-5 w-5 text-amber-600" /> Inventory Records</h2><p className="mt-0.5 text-xs text-slate-500">{totalStock} units currently available across all products.</p></div><button onClick={() => openUsageModal()} className="no-print inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white"><Truck className="h-4 w-4" /> Record Vehicle Usage</button></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Category / Supplier</th><th className="px-4 py-3">Received</th><th className="px-4 py-3">Used</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Cost</th><th className="no-print px-4 py-3 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? <tr><td colSpan="7" className="py-12 text-center text-slate-500">Loading product records...</td></tr> : products.length === 0 ? <tr><td colSpan="7" className="py-12 text-center text-slate-500">No product records found.</td></tr> : products.map((product) => { const stock = getStock(product); return <tr key={product._id} className="hover:bg-slate-50"><td className="px-4 py-3"><strong className="block text-sm text-slate-900">{product.name}</strong><span className="font-mono text-[10px] text-slate-500">{product.partNumber || 'No part number'} | {product.brand || 'No brand'}</span></td><td className="px-4 py-3"><span className="font-semibold">{product.category}</span><span className="block text-[10px] text-slate-500">{product.supplier || 'Supplier not set'}</span></td><td className="px-4 py-3 font-bold">{product.quantityReceived} {product.unit}</td><td className="px-4 py-3 font-bold text-amber-700">{product.quantityUsed || 0} {product.unit}</td><td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 font-black ${stock <= 2 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{stock} {product.unit}</span></td><td className="px-4 py-3 font-semibold">₹{Number(product.unitCost || 0).toLocaleString('en-IN')}</td><td className="no-print whitespace-nowrap px-4 py-3 text-right"><button onClick={() => openUsageModal(product)} title="Record usage" className="mr-1 rounded-lg bg-amber-50 p-2 text-amber-700"><Truck className="h-4 w-4" /></button><button onClick={() => openProductModal(product)} title="Edit product" className="mr-1 rounded-lg bg-slate-100 p-2 text-slate-700"><Edit3 className="h-4 w-4" /></button><button onClick={() => handleDeleteProduct(product)} title="Delete product" className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button></td></tr>; })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4"><h2 className="flex items-center gap-2 text-base font-black text-slate-900"><History className="h-5 w-5 text-amber-600" /> Vehicle Usage History</h2><p className="mt-0.5 text-xs text-slate-500">Every spare part issued against a vehicle.</p></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs text-slate-700"><thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Product</th><th className="px-4 py-3">Vehicle</th><th className="px-4 py-3">Quantity</th><th className="px-4 py-3">Odometer</th><th className="px-4 py-3">Remarks</th><th className="no-print px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{usageRows.length === 0 ? <tr><td colSpan="7" className="py-10 text-center text-slate-500">No vehicle usage recorded yet.</td></tr> : usageRows.sort((a, b) => new Date(b.usedDate) - new Date(a.usedDate)).map((row) => <tr key={`${row.productId}-${row._id}`}><td className="px-4 py-3 font-semibold">{formatDate(row.usedDate)}</td><td className="px-4 py-3"><strong className="text-slate-900">{row.productName}</strong><span className="block text-[10px] text-slate-500">{row.partNumber || '-'}</span></td><td className="px-4 py-3 font-mono font-bold">{row.vehicleNumber}</td><td className="px-4 py-3 font-bold text-amber-700">{row.quantity} {row.unit}</td><td className="px-4 py-3">{Number(row.odometer || 0).toLocaleString('en-IN')} km</td><td className="max-w-[220px] px-4 py-3">{row.remarks || '-'}</td><td className="no-print whitespace-nowrap px-4 py-3 text-right"><button onClick={() => openUsageModal(products.find((product) => product._id === row.productId), row)} title="Edit usage" className="mr-1 rounded-lg bg-slate-100 p-2 text-slate-700"><Edit3 className="h-4 w-4" /></button><button onClick={() => handleDeleteUsage(row)} title="Delete usage" className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button></td></tr>)}</tbody></table></div>
        </section>
      </div>

      {modal && <div className="no-print fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm"><div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-amber-50 px-5 py-4 sm:px-6"><div><h2 className="text-lg font-black text-slate-900">{modal === 'product' ? (editingProduct ? 'Edit Product Record' : 'Receive Product') : (editingUsage ? 'Edit Vehicle Usage' : 'Record Vehicle Usage')}</h2><p className="mt-0.5 text-xs text-slate-500">{modal === 'product' ? 'Add stock and supplier details.' : 'Deduct spare parts from inventory for a vehicle.'}</p></div><button onClick={() => setModal(null)} className="rounded-xl p-2 hover:bg-amber-100" title="Close"><X className="h-5 w-5" /></button></div>{modal === 'product' ? <form onSubmit={handleProductSave} className="space-y-4 p-5 sm:p-6"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-slate-700">Product Name *<input required value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} placeholder="Brake pad, engine oil..." className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold" /></label><label className="text-xs font-bold text-slate-700">Part Number<input value={productForm.partNumber} onChange={(event) => setProductForm({ ...productForm, partNumber: event.target.value })} placeholder="BP-001" className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold uppercase" /></label><label className="text-xs font-bold text-slate-700">Category<input value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} placeholder="Spare Part" className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" /></label><label className="text-xs font-bold text-slate-700">Brand<input value={productForm.brand} onChange={(event) => setProductForm({ ...productForm, brand: event.target.value })} placeholder="Bosch, Castrol..." className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" /></label><label className="text-xs font-bold text-slate-700">Unit<select value={productForm.unit} onChange={(event) => setProductForm({ ...productForm, unit: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"><option>Piece</option><option>Set</option><option>Litre</option><option>Kg</option><option>Box</option><option>Pair</option></select></label><label className="text-xs font-bold text-slate-700">Supplier<input value={productForm.supplier} onChange={(event) => setProductForm({ ...productForm, supplier: event.target.value })} placeholder="Supplier name" className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" /></label><label className="text-xs font-bold text-slate-700">Received Date *<input type="date" required value={productForm.purchaseDate} onChange={(event) => setProductForm({ ...productForm, purchaseDate: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" /></label><label className="text-xs font-bold text-slate-700">Quantity Received *<input type="number" min="0" step="1" required value={productForm.quantityReceived} onChange={(event) => setProductForm({ ...productForm, quantityReceived: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" /></label><label className="text-xs font-bold text-slate-700">Unit Cost (Rs.)<input type="number" min="0" step="0.01" value={productForm.unitCost} onChange={(event) => setProductForm({ ...productForm, unitCost: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" /></label></div><label className="block text-xs font-bold text-slate-700">Notes<textarea value={productForm.notes} onChange={(event) => setProductForm({ ...productForm, notes: event.target.value })} rows="3" className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" /></label><div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => setModal(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600">Cancel</button><button type="submit" className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-black text-slate-950">{editingProduct ? 'Update Product' : 'Save Product'}</button></div></form> : <form onSubmit={handleUsageSave} className="space-y-4 p-5 sm:p-6"><label className="block text-xs font-bold text-slate-700">Product *<select required disabled={Boolean(editingUsage)} value={usageForm.productId} onChange={(event) => setUsageForm({ ...usageForm, productId: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold"><option value="">Select product</option>{products.map((product) => <option key={product._id} value={product._id}>{product.name} - {getStock(product)} {product.unit} available</option>)}</select></label><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-slate-700">Vehicle *<select required value={usageForm.vehicleNumber} onChange={(event) => setUsageForm({ ...usageForm, vehicleNumber: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"><option value="">Select vehicle</option>{vehicles.map((vehicle) => <option key={vehicle._id} value={vehicle.vehicleNumber}>{vehicle.vehicleNumber}</option>)}</select></label><label className="text-xs font-bold text-slate-700">Usage Date *<input type="date" required value={usageForm.usedDate} onChange={(event) => setUsageForm({ ...usageForm, usedDate: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" /></label><label className="text-xs font-bold text-slate-700">Quantity Used *<input type="number" min="1" step="1" required value={usageForm.quantity} onChange={(event) => setUsageForm({ ...usageForm, quantity: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" /></label><label className="text-xs font-bold text-slate-700">Odometer (km)<input type="number" min="0" step="1" value={usageForm.odometer} onChange={(event) => setUsageForm({ ...usageForm, odometer: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" /></label></div><label className="block text-xs font-bold text-slate-700">Remarks<textarea value={usageForm.remarks} onChange={(event) => setUsageForm({ ...usageForm, remarks: event.target.value })} rows="3" placeholder="Reason, workshop, technician..." className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" /></label><div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => setModal(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600">Cancel</button><button type="submit" className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white">{editingUsage ? 'Update Usage' : 'Save Usage'}</button></div></form>}</div></div>}
    </>
  );
};

export default ProductManagementPage;
