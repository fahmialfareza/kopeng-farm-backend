const faker = require('faker');
const moment = require('moment');
const { merchant, farmer, landArea, seedType } = require('../models');

// Seeder add
exports.addMerchants = async () => {
  let data = await Promise.all([
    farmer.find(),
    landArea.find(),
    seedType.find(),
  ]);

  let harvestsEstimation = [];

  for (let i = 0; i < 50; i++) {
    let plantDate = faker.datatype.datetime();
    let productionEstimation = Math.floor(Math.random() * 10000);

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

    await merchant.create({
      farmer: data[0][i]._id,
      landArea: data[1][i]._id,
      seedType: data[2][i % data[2].length]._id,
      plantDate: plantDate,
      population: Math.floor(Math.random() * 10000),
      harvestsEstimation: harvestsEstimation,
      productionEstimation: productionEstimation,
      priceEstimation: eval(
        data[3][i % data[3].length].price * productionEstimation
      ),
    });

    harvestsEstimation = [];
  }

  console.log('Merchants have been added');
};

// Seeder undo
exports.deleteMerchants = async () => {
  await merchant.remove();

  console.log('Merchants have beend deleted');
};
