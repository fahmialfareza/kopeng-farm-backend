const faker = require('faker');
const { harvest, merchant } = require('../models');

// Seeder add
exports.addHarvests = async () => {
  const merchants = await merchant.find().populate({
    path: 'seedType',
    populate: { path: 'vegetable' },
  });

  for (let i = 0; i < 50; i++) {
    const vegetablePrice = merchants[i].seedType.vegetable.price;
    const vegetableCommission = merchants[i].seedType.vegetable.commission;
    const seedTypePrice = merchants[i].seedType.price;
    const production = merchants[i].productionEstimation;
    const totalAmount = production * vegetablePrice;
    const commissionAmount = (vegetableCommission * totalAmount) / 100;
    const debt = merchants[i].population * seedTypePrice;
    const netAmount = totalAmount - commissionAmount - debt;

    await harvest.create({
      merchant: merchants[i]._id,
      production,
      commissionAmount,
      totalAmount,
      debt,
      netAmount,
    });
  }

  console.log('Harvests have been added');
};

// Seeder undo
exports.deleteHarvests = async () => {
  await harvest.remove();

  console.log('Harvests have beend deleted');
};
