const Organizer = require('../models/Organizer');
const store = require('../config/store');

const getOrganizers = async (req, res) => {
  try {
    const { search, status } = req.query;

    if (store.isMongo()) {
      let query = {};
      if (status && status !== 'All') query.status = status;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
        ];
      }

      const organizers = await Organizer.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: organizers.length, data: organizers });
    }

    // Fallback store
    let filtered = store.data.organizers ? [...store.data.organizers] : [];
    if (status && status !== 'All') {
      filtered = filtered.filter((o) => o.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          (o.name && o.name.toLowerCase().includes(s)) ||
          (o.phone && o.phone.toLowerCase().includes(s)) ||
          (o.company && o.company.toLowerCase().includes(s)) ||
          (o.address && o.address.toLowerCase().includes(s))
      );
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('getOrganizers error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrganizerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (store.isMongo()) {
      const organizer = await Organizer.findById(id);
      if (!organizer) return res.status(404).json({ success: false, message: 'Organizer not found' });
      return res.json({ success: true, data: organizer });
    }

    const organizer = store.data.organizers?.find((o) => String(o._id) === String(id));
    if (!organizer) return res.status(404).json({ success: false, message: 'Organizer not found' });
    res.json({ success: true, data: organizer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createOrganizer = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Organizer name is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Organizer phone number is required' });
    }

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: req.body.email?.trim() || '',
      company: req.body.company?.trim() || '',
      address: req.body.address?.trim() || '',
      notes: req.body.notes?.trim() || '',
      status: req.body.status || 'Active',
    };

    if (store.isMongo()) {
      const organizer = new Organizer(payload);
      const saved = await organizer.save();
      return res.status(201).json({ success: true, data: saved });
    }

    const newOrganizer = {
      _id: `org-${Date.now()}`,
      ...payload,
      createdAt: new Date(),
    };
    if (!store.data.organizers) store.data.organizers = [];
    store.data.organizers.unshift(newOrganizer);
    res.status(201).json({ success: true, data: newOrganizer });
  } catch (error) {
    console.error('createOrganizer error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to save organizer' });
  }
};

const updateOrganizer = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (store.isMongo()) {
      const organizer = await Organizer.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
      if (!organizer) return res.status(404).json({ success: false, message: 'Organizer not found' });
      return res.json({ success: true, data: organizer });
    }

    if (!store.data.organizers) store.data.organizers = [];
    const index = store.data.organizers.findIndex((o) => String(o._id) === String(id));
    if (index === -1) return res.status(404).json({ success: false, message: 'Organizer not found' });

    store.data.organizers[index] = { ...store.data.organizers[index], ...payload, updatedAt: new Date() };
    res.json({ success: true, data: store.data.organizers[index] });
  } catch (error) {
    console.error('updateOrganizer error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to update organizer' });
  }
};

const deleteOrganizer = async (req, res) => {
  try {
    const { id } = req.params;

    if (store.isMongo()) {
      const organizer = await Organizer.findById(id);
      if (!organizer) return res.status(404).json({ success: false, message: 'Organizer not found' });
      await organizer.deleteOne();
      return res.json({ success: true, message: 'Organizer deleted successfully' });
    }

    if (!store.data.organizers) store.data.organizers = [];
    store.data.organizers = store.data.organizers.filter((o) => String(o._id) !== String(id));
    res.json({ success: true, message: 'Organizer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOrganizers,
  getOrganizerById,
  createOrganizer,
  updateOrganizer,
  deleteOrganizer,
};
