const faker = require('faker');
const moment = require('moment');
const {
  plant,
  farmer,
  landArea,
  seedType,
  vegetable,
  user,
} = require('../models');

// Seeder add
exports.addPlants = async () => {
  let farmers = await farmer.find();
  let landAreas = await landArea.find();
  let seedTypes = await seedType.find();
  let vegetables = await vegetable.find();
  let users = await user.find();

  let harvestsEstimation = [];

  for (let i = 0; i < 50; i++) {
    let plantDate = faker.datatype.datetime();

    vegetables[i].harvestsEstimation.map((data, index) => {
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
      farmer: farmers[i]._id,
      landArea: landAreas[i]._id,
      seedType: seedTypes[i]._id,
      vegetable: vegetables[i]._id,
      plantDate: plantDate,
      population: Math.floor(Math.random() * 10000),
      harvestsEstimation: harvestsEstimation,
      productionEstimation: Math.floor(Math.random() * 10000),
      user: users[i]._id,
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
