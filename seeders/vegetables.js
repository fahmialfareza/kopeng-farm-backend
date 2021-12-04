const faker = require('faker');
const { vegetable } = require('../models');
const vegetablesData = require('../data/vegetables.json');

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
