const moment = require('moment');

let date = new Date('2098-02-26T00:00:00.000Z').toISOString();

let newdate = moment(date).locale('id').format('Do MMMM YYYY');

console.log(newdate);
