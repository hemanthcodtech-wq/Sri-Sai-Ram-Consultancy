// Standalone store manager: seamlessly handles both MongoDB and in-memory/file fallback
const mongoose = require('mongoose');

let isMongoConnected = false;

// Clean store data with only admin user
const initialData = {
  users: [
    {
      _id: 'usr-admin-01',
      name: 'Shekar Babu Sabbineni',
      email: 'shekarbabu.sabbineni@gmail.com',
      password: 'SSRC@2026',
      role: 'admin',
      createdAt: new Date(),
    },
  ],
  employees: [],
  trips: [],
  inquiries: [],
  organizers: [],
  routes: [],
};

const store = {
  data: { ...initialData },
  isMongo: () => isMongoConnected,
  setMongoConnected: (status) => {
    isMongoConnected = status;
  },
};

module.exports = store;
