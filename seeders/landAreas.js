const faker = require('faker');
const { farmer, landArea } = require('../models');

// Seeder add
exports.addLandAreas = async () => {
  let farmers = await farmer.find();

  for (let i = 0; i < 50; i++) {
    await landArea.create({
      farmer: farmers[i]._id,
      area: Math.floor(Math.random() * 2000),
      coordinate: {
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
      },
    });
  }

  console.log('Land Areas have been added');
};

// Seeder undo
exports.deleteLandAreas = async () => {
  await landArea.remove();

  console.log('Land Areas have beend deleted');
};
