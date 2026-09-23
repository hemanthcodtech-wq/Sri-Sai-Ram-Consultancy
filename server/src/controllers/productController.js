const Product = require('../models/Product');
const store = require('../config/store');

const normalizeProduct = (body) => ({
  name: String(body.name || '').trim(),
  partNumber: String(body.partNumber || '').trim().toUpperCase(),
  category: String(body.category || 'Spare Part').trim(),
  brand: String(body.brand || '').trim(),
  unit: String(body.unit || 'Piece').trim(),
  supplier: String(body.supplier || '').trim(),
  purchaseDate: body.purchaseDate,
  quantityReceived: Number(body.quantityReceived),
  unitCost: Number(body.unitCost || 0),
  notes: String(body.notes || '').trim(),
});

const validateProduct = (payload) => {
  if (!payload.name || !payload.purchaseDate) return 'Product name and purchase date are required.';
  if (!Number.isFinite(payload.quantityReceived) || payload.quantityReceived < 0) return 'Received quantity must be a valid non-negative number.';
  if (!Number.isFinite(payload.unitCost) || payload.unitCost < 0) return 'Unit cost must be a valid non-negative number.';
  return null;
};

const normalizeUsage = (body) => ({
  vehicleNumber: String(body.vehicleNumber || '').trim().toUpperCase(),
  quantity: Number(body.quantity),
  usedDate: body.usedDate,
  odometer: Number(body.odometer || 0),
  remarks: String(body.remarks || '').trim(),
});

const validateUsage = (payload) => {
  if (!payload.vehicleNumber || !payload.usedDate) return 'Vehicle number and usage date are required.';
  if (!Number.isInteger(payload.quantity) || payload.quantity < 1) return 'Used quantity must be a whole number greater than zero.';
  if (!Number.isFinite(payload.odometer) || payload.odometer < 0) return 'Odometer must be a valid non-negative number.';
  return null;
};

const stockFor = (product) => Math.max(0, Number(product.quantityReceived || 0) - Number(product.quantityUsed || 0));

const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    if (store.isMongo()) {
      const query = {};
      if (category && category !== 'All') query.category = category;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { partNumber: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { supplier: { $regex: search, $options: 'i' } },
        ];
      }
      const products = await Product.find(query).sort({ purchaseDate: -1, createdAt: -1 });
      return res.json({ success: true, data: products, count: products.length });
    }

    let products = [...(store.data.products || [])];
    if (category && category !== 'All') products = products.filter((product) => product.category === category);
    if (search) {
      const term = search.toLowerCase();
      products = products.filter((product) => [product.name, product.partNumber, product.brand, product.supplier].some((value) => String(value || '').toLowerCase().includes(term)));
    }
    products.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    res.json({ success: true, data: products.map((product) => ({ ...product, stock: stockFor(product) })), count: products.length });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product records.' });
  }
};

const createProduct = async (req, res) => {
  try {
    const payload = normalizeProduct(req.body);
    const validationError = validateProduct(payload);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    if (store.isMongo()) {
      const product = await Product.create(payload);
      return res.status(201).json({ success: true, data: product, message: 'Product received into inventory.' });
    }

    if (!store.data.products) store.data.products = [];
    const product = { _id: `product-${Date.now()}`, ...payload, quantityUsed: 0, usageRecords: [], createdAt: new Date(), updatedAt: new Date() };
    store.data.products.unshift(product);
    res.status(201).json({ success: true, data: { ...product, stock: stockFor(product) }, message: 'Product received into inventory.' });
  } catch (error) {
    console.error('createProduct error:', error);
    res.status(500).json({ success: false, message: 'Failed to add product record.' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const payload = normalizeProduct(req.body);
    const validationError = validateProduct(payload);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    if (store.isMongo()) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Product record not found.' });
      if (payload.quantityReceived < product.quantityUsed) return res.status(400).json({ success: false, message: 'Received quantity cannot be less than quantity already used.' });
      Object.assign(product, payload);
      await product.save();
      return res.json({ success: true, data: product, message: 'Product record updated.' });
    }

    const products = store.data.products || [];
    const index = products.findIndex((product) => String(product._id) === String(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, message: 'Product record not found.' });
    if (payload.quantityReceived < products[index].quantityUsed) return res.status(400).json({ success: false, message: 'Received quantity cannot be less than quantity already used.' });
    products[index] = { ...products[index], ...payload, updatedAt: new Date() };
    res.json({ success: true, data: { ...products[index], stock: stockFor(products[index]) }, message: 'Product record updated.' });
  } catch (error) {
    console.error('updateProduct error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product record.' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (store.isMongo()) {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Product record not found.' });
      return res.json({ success: true, message: 'Product record deleted.' });
    }
    const products = store.data.products || [];
    const exists = products.some((product) => String(product._id) === String(req.params.id));
    if (!exists) return res.status(404).json({ success: false, message: 'Product record not found.' });
    store.data.products = products.filter((product) => String(product._id) !== String(req.params.id));
    res.json({ success: true, message: 'Product record deleted.' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product record.' });
  }
};

const addProductUsage = async (req, res) => {
  try {
    const payload = normalizeUsage(req.body);
    const validationError = validateUsage(payload);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    if (store.isMongo()) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Product record not found.' });
      if (product.quantityUsed + payload.quantity > product.quantityReceived) return res.status(400).json({ success: false, message: 'Not enough stock available for this usage.' });
      product.usageRecords.push(payload);
      product.quantityUsed += payload.quantity;
      await product.save();
      return res.status(201).json({ success: true, data: product, message: 'Product usage recorded.' });
    }

    const product = (store.data.products || []).find((item) => String(item._id) === String(req.params.id));
    if (!product) return res.status(404).json({ success: false, message: 'Product record not found.' });
    if (product.quantityUsed + payload.quantity > product.quantityReceived) return res.status(400).json({ success: false, message: 'Not enough stock available for this usage.' });
    const usage = { _id: `usage-${Date.now()}`, ...payload, createdAt: new Date(), updatedAt: new Date() };
    product.usageRecords.push(usage);
    product.quantityUsed += payload.quantity;
    product.updatedAt = new Date();
    res.status(201).json({ success: true, data: { ...product, stock: stockFor(product) }, message: 'Product usage recorded.' });
  } catch (error) {
    console.error('addProductUsage error:', error);
    res.status(500).json({ success: false, message: 'Failed to record product usage.' });
  }
};

const updateProductUsage = async (req, res) => {
  try {
    const payload = normalizeUsage(req.body);
    const validationError = validateUsage(payload);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    if (store.isMongo()) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Product record not found.' });
      const usage = product.usageRecords.id(req.params.usageId);
      if (!usage) return res.status(404).json({ success: false, message: 'Usage record not found.' });
      const nextUsed = product.quantityUsed - usage.quantity + payload.quantity;
      if (nextUsed > product.quantityReceived) return res.status(400).json({ success: false, message: 'Not enough stock available for this usage.' });
      Object.assign(usage, payload);
      product.quantityUsed = nextUsed;
      await product.save();
      return res.json({ success: true, data: product, message: 'Product usage updated.' });
    }

    const product = (store.data.products || []).find((item) => String(item._id) === String(req.params.id));
    if (!product) return res.status(404).json({ success: false, message: 'Product record not found.' });
    const usage = product.usageRecords.find((item) => String(item._id) === String(req.params.usageId));
    if (!usage) return res.status(404).json({ success: false, message: 'Usage record not found.' });
    const nextUsed = product.quantityUsed - usage.quantity + payload.quantity;
    if (nextUsed > product.quantityReceived) return res.status(400).json({ success: false, message: 'Not enough stock available for this usage.' });
    Object.assign(usage, payload, { updatedAt: new Date() });
    product.quantityUsed = nextUsed;
    product.updatedAt = new Date();
    res.json({ success: true, data: { ...product, stock: stockFor(product) }, message: 'Product usage updated.' });
  } catch (error) {
    console.error('updateProductUsage error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product usage.' });
  }
};

const deleteProductUsage = async (req, res) => {
  try {
    if (store.isMongo()) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Product record not found.' });
      const usage = product.usageRecords.id(req.params.usageId);
      if (!usage) return res.status(404).json({ success: false, message: 'Usage record not found.' });
      product.quantityUsed -= usage.quantity;
      usage.deleteOne();
      await product.save();
      return res.json({ success: true, data: product, message: 'Product usage deleted.' });
    }

    const product = (store.data.products || []).find((item) => String(item._id) === String(req.params.id));
    if (!product) return res.status(404).json({ success: false, message: 'Product record not found.' });
    const usage = product.usageRecords.find((item) => String(item._id) === String(req.params.usageId));
    if (!usage) return res.status(404).json({ success: false, message: 'Usage record not found.' });
    product.quantityUsed -= usage.quantity;
    product.usageRecords = product.usageRecords.filter((item) => String(item._id) !== String(req.params.usageId));
    product.updatedAt = new Date();
    res.json({ success: true, data: { ...product, stock: stockFor(product) }, message: 'Product usage deleted.' });
  } catch (error) {
    console.error('deleteProductUsage error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product usage.' });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductUsage,
  updateProductUsage,
  deleteProductUsage,
};
