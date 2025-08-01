const Role = require('../models/Role');
const User = require('../models/User');
const bcrypt = require('bcrypt');

async function createDefaultSuperAdmin() {
  let superAdminRole = await Role.findOne({ name: 'superadmin' });
  if (!superAdminRole) {
    superAdminRole = await Role.create({
      name: 'superadmin'
    });
  }



  let adminEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@example.com';
  let superAdmin = await User.findOne({ email: adminEmail });
  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash(process.env.SUPERADMIN_PASS || 'SuperSecret123', 10);
    await User.create({
        email: adminEmail,
        password: hashedPassword,
        first_name: 'Super',
        last_name: 'Admin',
        mobile_number: process.env.SUPERADMIN_MOBILE || '1234567890',
        role_id: superAdminRole._id,
        status: 'active',
        is_email_verified: true,
        is_mobile_number_verified: true,
        is_account_approved: true,
        department_type: 'superadmin'
    });
  }


  let userRole = await Role.findOne({ name: 'user' });
  let userEmail = process.env.SUPERADMIN_EMAIL || 'achalchauhan15@gmail.com';
  let user = await User.findOne({ email: userEmail });
  if (!user) {
    const hashedPassword = await bcrypt.hash(process.env.SUPERADMIN_PASS || 'SuperSecret@12', 10);
    await User.create({
        email: userEmail,
        password: hashedPassword,
        first_name: 'Achal',
        last_name: 'Singh',
        mobile_number: process.env.SUPERADMIN_MOBILE || '7717415759',
        role_id: userRole._id,
        status: 'active',
        is_email_verified: true,
        is_mobile_number_verified: true,
        is_account_approved: true,
        consumerCode: '123456789',
        department_type: 'user'
    });
  }

  // RC UJS
  let rcRole = await Role.findOne({ name: 'rc' });
  let rcEmail = process.env.SUPERADMIN_EMAIL || 'demorcujs@gmail.com';
  let rcujs = await User.findOne({ email: rcEmail });
  if (!rcujs) {
    const hashedPassword = await bcrypt.hash(process.env.SUPERADMIN_PASS || 'SuperSecret@12', 10);
    await User.create({
        email: rcEmail,
        password: hashedPassword,
        first_name: 'Achal',
        last_name: 'Singh',
        mobile_number: process.env.SUPERADMIN_MOBILE || '9041619008',
        role_id: rcRole._id,
        status: 'active',
        is_email_verified: true,
        is_mobile_number_verified: true,
        is_account_approved: true,
        department_type: 'ujs'
    });
  }

  // RC UJN
  let rcujnEmail = process.env.SUPERADMIN_EMAIL || 'demorcujn@gmail.com';
  let rcujn = await User.findOne({ email: rcujnEmail });
  if (!rcujn) {
    const hashedPassword = await bcrypt.hash(process.env.SUPERADMIN_PASS || 'SuperSecret@12', 10);
    await User.create({
        email: rcujnEmail,
        password: hashedPassword,
        first_name: 'Achal',
        last_name: 'Singh',
        mobile_number: process.env.SUPERADMIN_MOBILE || '9041619009',
        role_id: rcRole._id,
        status: 'active',
        is_email_verified: true,
        is_mobile_number_verified: true,
        is_account_approved: true,
        department_type: 'ujn'
    });
  }


}

module.exports = createDefaultSuperAdmin;