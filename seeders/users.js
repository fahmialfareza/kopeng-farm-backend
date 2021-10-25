const faker = require('faker');
const { user } = require('../models');

// Seeder add
exports.addUsers = async () => {
  for (let i = 0; i < 50; i++) {
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
