const Role = require('../models/Role');

async function seedDefaultRoles() {
  const defaultRoles = ['user', 'admin', 'superadmin', 'ro', 'rc', 'je', 'sse','ee','md','secretary'];

  for (const roleName of defaultRoles) {
    const exists = await Role.findOne({ name: roleName });
    console.log(exists, ",----------. exists");
    if (!exists) {
      await Role.create({ name: roleName });
      
    }
  }
}

module.exports = seedDefaultRoles;