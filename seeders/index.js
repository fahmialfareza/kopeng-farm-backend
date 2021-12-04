const { addFarmers, deleteFarmers } = require('./farmers');
const { addHarvests, deleteHarvests } = require('./harvests');
const { addLandAreas, deleteLandAreas } = require('./landAreas');
const { addMerchants, deleteMerchants } = require('./merchants');
const { addSeedTypes, deleteSeedTypes } = require('./seedTypes');
const { addUsers, deleteUsers } = require('./users');
const { addVegetables, deleteVegetables } = require('./vegetables');

async function add() {
  if (process.env.NODE_ENV === 'production') {
    await Promise.all([addVegetables(), addSeedTypes()]);
  } else {
    await Promise.all([addUsers(), addVegetables(), addSeedTypes()]);
    await addFarmers();
    await addLandAreas();
    await addMerchants();
    await addHarvests();
  }
}

async function remove() {
  await Promise.all([
    deleteFarmers(),
    deleteHarvests(),
    deleteLandAreas(),
    deleteMerchants(),
    deleteSeedTypes(),
    deleteUsers(),
    deleteVegetables(),
  ]);
}

if (process.argv[2] === 'add') {
  add().then(() => {
    console.log('Seeders success');
    process.exit(0);
  });
} else if (process.argv[2] === 'remove') {
  remove().then(() => {
    console.log('Delete data success');
    process.exit(0);
  });
}
