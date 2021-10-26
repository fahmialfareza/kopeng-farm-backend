const faker = require('faker');
const moment = require('moment');
const { plant, farmer, landArea, seedType, vegetable } = require('../models');

// Seeder add
exports.addPlants = async () => {
  let data = await Promise.all([
    farmer.find(),
    landArea.find(),
    seedType.find(),
    vegetable.find(),
  ]);

  let harvestsEstimation = [];

  for (let i = 0; i < 50; i++) {
    let plantDate = faker.datatype.datetime();

    data[3][i % data[3].length].harvestsEstimation.map((data, index) => {
      let startDate = moment(plantDate)
        .add(data.start, 'weeks')
        .format('YYYY-MM-DD');
      let endDate = moment(plantDate)
        .add(data.end, 'weeks')
        .subtract(1, 'days')
        .format('YYYY-MM-DD');

      harvestsEstimation.push({
        name: data.name,
        start: startDate,
        end: endDate,
      });
    });

    await plant.create({
      farmer: data[0][i]._id,
      landArea: data[1][i]._id,
      seedType: data[2][i]._id,
      vegetable: data[3][i % data[3].length]._id,
      plantDate: plantDate,
      population: Math.floor(Math.random() * 10000),
      harvestsEstimation: harvestsEstimation,
      productionEstimation: Math.floor(Math.random() * 10000),
    });

    harvestsEstimation = [];
  }

  console.log('Plants have been added');
};

// Seeder undo
exports.deletePlants = async () => {
  await plant.remove();

  console.log('Plants have beend deleted');
};
