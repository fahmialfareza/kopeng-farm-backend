const moment = require('moment');
const data = require('./data/vegetablesHarvest.json');

data.map((item) => {
  item.harvests.map((harvest) => {
    let startDate = moment('2021-10-01')
      .add(harvest.start, 'weeks')
      .format('YYYY-MM-DD');
    let endDate = moment(startDate)
      .add(harvest.end, 'days')
      .format('YYYY-MM-DD');
    console.log(startDate, endDate);
  });
});
