const faker = require('faker');
const { seedType } = require('../models');

// Seeder add
exports.addSeedTypes = async () => {
  for (let i = 0; i < 10; i++) {
    await seedType.create({ name: faker.name.findName() });
  }

  console.log('Seed Types have been added');
};

// Seeder undo
exports.deleteSeedTypes = async () => {
  await seedType.remove();

  console.log('Seed Types have beend deleted');
};
