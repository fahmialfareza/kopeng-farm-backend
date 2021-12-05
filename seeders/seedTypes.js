const faker = require('faker');
const { seedType } = require('../models');
const seedTypeData =
  process.env.NODE_ENV === 'production'
    ? require('../data/seedTypes.json')
    : require('../data/seedTypesDev.json');

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
