const Inquiry = require('../models/Inquiry');
const store = require('../config/store');

const createInquiry = async (req, res) => {
  try {
    if (store.isMongo()) {
      const inquiry = new Inquiry(req.body);
      const saved = await inquiry.save();
      return res.status(201).json({
        success: true,
        message: 'Booking request submitted successfully! Our team will contact you shortly.',
        data: saved,
      });
    }

    const newInquiry = {
      _id: `inq-${Date.now()}`,
      ...req.body,
      status: 'New',
      serviceDate: req.body.serviceDate ? new Date(req.body.serviceDate) : new Date(),
      createdAt: new Date(),
    };
    store.data.inquiries.unshift(newInquiry);
    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully! Our team will contact you shortly.',
      data: newInquiry,
    });
  } catch (error) {
    console.error('createInquiry error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const getInquiries = async (req, res) => {
  try {
    const { status, serviceType, search } = req.query;

    if (store.isMongo()) {
      let query = {};
      if (status && status !== 'All') query.status = status;
      if (serviceType && serviceType !== 'All') query.serviceType = serviceType;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { pickupLocation: { $regex: search, $options: 'i' } },
        ];
      }

      const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: inquiries.length, data: inquiries });
    }

    let filtered = [...store.data.inquiries];
    if (status && status !== 'All') {
      filtered = filtered.filter((i) => i.status === status);
    }
    if (serviceType && serviceType !== 'All') {
      filtered = filtered.filter((i) => i.serviceType === serviceType);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          (i.name && i.name.toLowerCase().includes(s)) ||
          (i.phone && i.phone.toLowerCase().includes(s)) ||
          (i.pickupLocation && i.pickupLocation.toLowerCase().includes(s))
      );
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    if (store.isMongo()) {
      const inquiry = await Inquiry.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
      return res.json({ success: true, data: inquiry });
    }

    const index = store.data.inquiries.findIndex((i) => String(i._id) === String(id));
    if (index === -1) return res.status(404).json({ success: false, message: 'Inquiry not found' });

    store.data.inquiries[index] = { ...store.data.inquiries[index], ...req.body, updatedAt: new Date() };
    res.json({ success: true, data: store.data.inquiries[index] });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    if (store.isMongo()) {
      const inquiry = await Inquiry.findById(id);
      if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
      await inquiry.deleteOne();
      return res.json({ success: true, message: 'Inquiry removed successfully' });
    }

    store.data.inquiries = store.data.inquiries.filter((i) => String(i._id) !== String(id));
    res.json({ success: true, message: 'Inquiry removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createInquiry, getInquiries, updateInquiry, deleteInquiry };
