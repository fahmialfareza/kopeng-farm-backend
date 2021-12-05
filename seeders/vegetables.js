const faker = require('faker');
const { vegetable } = require('../models');
const vegetablesData =
  process.env.NODE_ENV === 'production'
    ? require('../data/vegetables.json')
    : require('../data/vegetablesDev.json');

// Seeder add
exports.addVegetables = async () => {
  await vegetable.insertMany(vegetablesData);

  console.log('Vegetables have been added');
};

// Seeder undo
exports.deleteVegetables = async () => {
  await vegetable.remove();

  console.log('Vegetables have beend deleted');
};
