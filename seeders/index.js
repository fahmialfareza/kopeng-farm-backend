const { addFarmers, deleteFarmers } = require('./farmers');
const { addLandAreas, deleteLandAreas } = require('./landAreas');
const { addPlants, deletePlants } = require('./plants');
const { addSeedTypes, deleteSeedTypes } = require('./seedTypes');
const { addUsers, deleteUsers } = require('./users');
const { addVegetables, deleteVegetables } = require('./vegetables');

async function add() {
  await Promise.all([
    addFarmers(),
    addSeedTypes(),
    addUsers(),
    addVegetables(),
  ]);
  await addLandAreas();
  await addPlants();
}

async function remove() {
  await Promise.all([
    deleteFarmers(),
    deleteLandAreas(),
    deletePlants(),
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
