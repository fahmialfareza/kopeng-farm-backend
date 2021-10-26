const faker = require('faker');
const { user } = require('../models');

// Seeder add
exports.addUsers = async () => {
  await Promise.all([
    user.create({
      name: 'Fahmi Alfareza',
      username: 'fahmialfareza',
      password: 'Aneh1234',
      mobileNumber: '081234567890',
      role: 'admin',
    }),
    user.create({
      name: 'Korlap',
      username: 'korlap',
      password: 'Aneh1234',
      mobileNumber: '081234567890',
    }),
  ]);

  for (let i = 0; i < 48; i++) {
    await user.create({
      name: faker.name.findName(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      mobileNumber: faker.phone.phoneNumber(),
    });
  }

  console.log('Users have been added');
};

// Seeder undo
exports.deleteUsers = async () => {
  await user.remove();

  console.log('Users have beend deleted');
};
