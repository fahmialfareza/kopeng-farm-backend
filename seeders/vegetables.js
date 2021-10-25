const faker = require('faker');
const { vegetable } = require('../models');

// Seeder add
exports.addVegetables = async () => {
  for (let i = 0; i < 50; i++) {
    await vegetable.create({
      name: faker.name.findName(),
      harvestsEstimation: [
        {
          name: 'Acar',
          start: Math.floor(1 + Math.random() * 5),
          end: Math.floor(5 + Math.random() * 4),
        },
        {
          name: 'Panen',
          start: Math.floor(10 + Math.random() * 15),
          end: Math.floor(15 + Math.random() * 19),
        },
      ],
    });
  }

  console.log('Vegetables have been added');
};

// Seeder undo
exports.deleteVegetables = async () => {
  await vegetable.remove();

  console.log('Vegetables have beend deleted');
};
