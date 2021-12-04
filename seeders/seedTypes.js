const faker = require('faker');
const { seedType } = require('../models');
const seedTypeData = require('../data/seedTypes.json');

// Seeder add
exports.addSeedTypes = async () => {
  await seedType.insertMany(seedTypeData);

  console.log('Seed Types have been added');
};

// Seeder undo
exports.deleteSeedTypes = async () => {
  await seedType.remove();

  console.log('Seed Types have beend deleted');
};
