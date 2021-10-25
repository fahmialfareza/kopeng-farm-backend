const faker = require('faker');
const { farmer } = require('../models');

// Seeder add
exports.addFarmers = async () => {
  for (let i = 0; i < 50; i++) {
    await farmer.create({
      id_number: Math.floor(
        1000000000000000 + Math.random() * 9000000000000000
      ),
      name: faker.name.findName(),
      address: faker.address.streetAddress(),
    });
  }

  console.log('Farmers have been added');
};

// Seeder undo
exports.deleteFarmers = async () => {
  await farmer.remove();

  console.log('Farmers have beend deleted');
};
