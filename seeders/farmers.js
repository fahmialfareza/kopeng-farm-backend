const faker = require('faker');
const { farmer, user } = require('../models');

// Seeder add
exports.addFarmers = async () => {
  const users = await user.find();

  for (let i = 0; i < 50; i++) {
    await farmer.create({
      id_number: Math.floor(
        1000000000000000 + Math.random() * 9000000000000000
      ),
      name: faker.name.findName(),
      address: faker.address.streetAddress(),
      user: users[i % users.length]._id,
    });
  }

  console.log('Farmers have been added');
};

// Seeder undo
exports.deleteFarmers = async () => {
  await farmer.remove();

  console.log('Farmers have beend deleted');
};
