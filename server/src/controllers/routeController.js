const Route = require('../models/RouteModel');
const store = require('../config/store');

const getRoutes = async (req, res) => {
  try {
    const { search, status } = req.query;

    if (store.isMongo()) {
      let query = {};
      if (status && status !== 'All') query.status = status;
      if (search) {
        query.$or = [
          { fromCity: { $regex: search, $options: 'i' } },
          { toCity: { $regex: search, $options: 'i' } },
          { routeName: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } },
        ];
      }

      const routes = await Route.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: routes.length, data: routes });
    }

    // Fallback store
    let filtered = store.data.routes ? [...store.data.routes] : [];
    if (status && status !== 'All') {
      filtered = filtered.filter((r) => r.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          (r.fromCity && r.fromCity.toLowerCase().includes(s)) ||
          (r.toCity && r.toCity.toLowerCase().includes(s)) ||
          (r.routeName && r.routeName.toLowerCase().includes(s)) ||
          (r.notes && r.notes.toLowerCase().includes(s))
      );
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('getRoutes error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (store.isMongo()) {
      const route = await Route.findById(id);
      if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
      return res.json({ success: true, data: route });
    }

    const route = store.data.routes?.find((r) => String(r._id) === String(id));
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
    res.json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createRoute = async (req, res) => {
  try {
    const { fromCity, toCity } = req.body;

    if (!fromCity || !fromCity.trim()) {
      return res.status(400).json({ success: false, message: 'Starting city (From) is required' });
    }
    if (!toCity || !toCity.trim()) {
      return res.status(400).json({ success: false, message: 'Ending city (To) is required' });
    }

    const routeName = req.body.routeName?.trim() || `${fromCity.trim()} → ${toCity.trim()}`;
    const payload = {
      fromCity: fromCity.trim(),
      toCity: toCity.trim(),
      routeName,
      distanceKm: Number(req.body.distanceKm) || 0,
      estimatedHours: req.body.estimatedHours?.trim() || '',
      status: req.body.status || 'Active',
      notes: req.body.notes?.trim() || '',
    };

    if (store.isMongo()) {
      const route = new Route(payload);
      const saved = await route.save();
      return res.status(201).json({ success: true, data: saved });
    }

    const newRoute = {
      _id: `rt-${Date.now()}`,
      ...payload,
      createdAt: new Date(),
    };
    if (!store.data.routes) store.data.routes = [];
    store.data.routes.unshift(newRoute);
    res.status(201).json({ success: true, data: newRoute });
  } catch (error) {
    console.error('createRoute error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to save route' });
  }
};

const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (payload.fromCity && payload.toCity && (!payload.routeName || !payload.routeName.trim())) {
      payload.routeName = `${payload.fromCity.trim()} → ${payload.toCity.trim()}`;
    }
    if (payload.distanceKm !== undefined) {
      payload.distanceKm = Number(payload.distanceKm) || 0;
    }

    if (store.isMongo()) {
      const route = await Route.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
      if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
      return res.json({ success: true, data: route });
    }

    if (!store.data.routes) store.data.routes = [];
    const index = store.data.routes.findIndex((r) => String(r._id) === String(id));
    if (index === -1) return res.status(404).json({ success: false, message: 'Route not found' });

    store.data.routes[index] = { ...store.data.routes[index], ...payload, updatedAt: new Date() };
    res.json({ success: true, data: store.data.routes[index] });
  } catch (error) {
    console.error('updateRoute error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to update route' });
  }
};

const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    if (store.isMongo()) {
      const route = await Route.findById(id);
      if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
      await route.deleteOne();
      return res.json({ success: true, message: 'Route removed successfully' });
    }

    if (!store.data.routes) store.data.routes = [];
    store.data.routes = store.data.routes.filter((r) => String(r._id) !== String(id));
    res.json({ success: true, message: 'Route removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
};
