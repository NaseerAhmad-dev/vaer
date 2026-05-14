require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: 'admin@noor.com' });
  if (existing) {
    console.log('Admin already exists — email: admin@noor.com');
    process.exit(0);
  }

  const hash = await bcrypt.hash('admin123', 10);
  await User.create({
    name:     'Admin',
    email:    'admin@noor.com',
    password: hash,
    role:     'admin',
  });

  console.log('✅ Admin user created');
  console.log('   Email:    admin@noor.com');
  console.log('   Password: admin123');
  process.exit(0);
}

main().catch(err => { console.error(err.message); process.exit(1); });
