const { plant } = require('../models');
const moment = require('moment');
const xlsx = require('json-as-xlsx');

class Plants {
  async exportsToXlxs(req, res, next) {
    try {
      const settings = {
        writeOptions: {
          type: 'buffer',
          bookType: 'xlsx',
        },
      };

      const fileName = 'Daftar Tanam Calon Mitra_' + Date.now().toString();

      let findData = {};

      req.query.createdAtStart &&
        (findData.createdAt = {
          $gte: new Date(req.query.createdAtStart),
        });
      req.query.createdAtEnd &&
        (findData.createdAt = {
          ...findData.createdAt,
          $lte: new Date(moment(req.query.createdAtEnd).add(1, 'days')),
        });
      req.query.farmer && (findData.farmer = req.query.farmer);
      req.query.vegetable && (findData.vegetable = req.query.vegetable);
      req.query.plantDateStart &&
        (findData.plantDate = {
          $gte: new Date(req.query.plantDateStart),
        });
      req.query.plantDateEnd &&
        (findData.plantDate = {
          ...findData.plantDate,
          $lte: new Date(moment(req.query.plantDateEnd).add(1, 'days')),
        });
      req.query.user && (findData.user = req.query.user);

      let dataPrinted = await plant
        .find(findData)
        .populate('farmer')
        .populate('landArea')
        .populate('seedType')
        .populate('vegetable')
        .populate('user');

      if (dataPrinted.length === 0) {
        next({ message: 'Data not found', statusCode: 404 });
      }

      dataPrinted = dataPrinted.map((data, index) => {
        return { index: index + 1, ...data._doc };
      });

      let data = await Promise.all([
        dataPrinted.filter((data) => data.vegetable.name === 'Brokoli'),
        dataPrinted.filter((data) => data.vegetable.name === 'Kol Putih'),
        dataPrinted.filter((data) => data.vegetable.name === 'Sawi Putih'),
        dataPrinted.filter((data) => data.vegetable.name === 'Jagung Manis'),
        dataPrinted.filter((data) => data.vegetable.name === 'Kembang Kol'),
        dataPrinted.filter((data) => data.vegetable.name === 'Kol Ungu'),
        dataPrinted.filter((data) => data.vegetable.name === 'Selada Hijau'),
        dataPrinted.filter((data) => data.vegetable.name === 'Pak Choy Baby'),
        dataPrinted.filter((data) => data.vegetable.name === 'Beet Root'),
        dataPrinted.filter((data) => data.vegetable.name === 'Sawi Hijau'),
        dataPrinted.filter((data) => data.vegetable.name === 'Pak Choy'),
        dataPrinted.filter((data) => data.vegetable.name === 'Terong Ungu'),
        dataPrinted.filter((data) => data.vegetable.name === 'Cabe Keriting'),
        dataPrinted.filter(
          (data) => data.vegetable.name === 'Cabe Rawit Merah'
        ),
        dataPrinted.filter(
          (data) => data.vegetable.name === 'Cabe Merah Besar'
        ),
        dataPrinted.filter(
          (data) => data.vegetable.name === 'Cabe Rawit Hijau Caplak'
        ),
        dataPrinted.filter(
          (data) => data.vegetable.name === 'Cabe Keriting Hijau'
        ),
        dataPrinted.filter((data) => data.vegetable.name === 'Cabe TW Hijau'),
      ]);

      const dataWillBePrinted = [
        {
          sheet: 'Daftar Tanam Calon Mitra',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: dataPrinted,
        },
      ];

      data[0].length > 0 &&
        (data[0] = data[0].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Brokoli',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[0],
        });
      data[1].length > 0 &&
        (data[1] = data[1].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Kol Putih',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[1],
        });
      data[2].length > 0 &&
        (data[2] = data[2].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Sawi Putih',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[2],
        });
      data[3].length > 0 &&
        (data[3] = data[3].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Jagung Manis',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            {
              label: 'Perkiraan Produksi (kg)',
              value: 'productionEstimation',
            },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[3],
        });
      data[4].length > 0 &&
        (data[4] = data[4].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Kembang Kol',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            {
              label: 'Perkiraan Produksi (kg)',
              value: 'productionEstimation',
            },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[4],
        });
      data[5].length > 0 &&
        (data[5] = data[5].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Kol Ungu',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[5],
        });
      data[6].length > 0 &&
        (data[6] = data[6].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Selada Hijau',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[6],
        });
      data[7].length > 0 &&
        (data[7] = data[7].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Pak Choy Baby',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            {
              label: 'Perkiraan Produksi (kg)',
              value: 'productionEstimation',
            },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[7],
        });
      data[8].length > 0 &&
        (data[8] = data[8].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Beet Root',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[8],
        });
      data[9].length > 0 &&
        (data[9] = data[9].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Sawi Hijau',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[9],
        });
      data[10].length > 0 &&
        (data[10] = data[10].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Pak Choy',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[10],
        });
      data[11].length > 0 &&
        (data[11] = data[11].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Terong Ungu',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[11],
        });
      data[12].length > 0 &&
        (data[12] = data[12].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Cabe Keriting',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[12],
        });
      data[13].length > 0 &&
        (data[13] = data[13].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Cabe Rawit Merah',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[13],
        });
      data[14].length > 0 &&
        (data[14] = data[14].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Cabe Merah Besar',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[14],
        });
      data[15].length > 0 &&
        (data[15] = data[15].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Cabe Rawit Hijau Caplak',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[15],
        });
      data[16].length > 0 &&
        (data[16] = data[16].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Cabe Keriting Hijau',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[16],
        });
      data[17].length > 0 &&
        (data[17] = data[17].map((data, index) => {
          return { index: index + 1, ...data };
        })) &&
        dataWillBePrinted.push({
          sheet: 'Cabe TW Hijau',
          columns: [
            { label: 'No', value: 'index' }, // Top level data
            {
              label: 'Tanggal',
              value: (row) => moment(row.createdAt).calendar(),
            },
            { label: 'NIK', value: (row) => row.farmer.id_number },
            { label: 'Nama Petani', value: (row) => row.farmer.name },
            { label: 'Alamat', value: (row) => row.farmer.name },
            { label: 'Luas Lahan (m2)', value: (row) => row.landArea.area },
            {
              label: 'Titik Ordinat',
              value: (row) =>
                `${row.landArea.coordinate.lat}, ${row.landArea.coordinate.lng}`,
            },
            { label: 'Jenis Bibit', value: (row) => row.seedType.name },
            { label: 'Jenis Sayur', value: (row) => row.vegetable.name },
            {
              label: 'Tanggal Tanam',
              value: (row) => moment(row.plantDate).calendar(),
            },
            { label: 'Populasi (batang)', value: 'population' },
            {
              label: 'Estimasi Panen',
              value: (row) =>
                row.harvestsEstimation
                  .map(
                    (harvest, index) =>
                      `${harvest.name} ${index + 1} (${moment(
                        harvest.start
                      ).calendar()} - ${moment(harvest.end).calendar()})`
                  )
                  .join(', '),
            },
            {
              label: 'Panen',
              value: (row) =>
                row.harvests
                  ? row.harvests
                      .map(
                        (harvest, index) =>
                          `${harvest.name} ${index + 1} (${moment(
                            harvest.start
                          ).calendar()} - ${moment(harvest.end).calendar()})`
                      )
                      .join(', ')
                  : '',
            },
            { label: 'Perkiraan Produksi (kg)', value: 'productionEstimation' },
            { label: 'Produksi (kg)', value: 'production' },
            { label: 'Kor Lap', value: (row) => row.user.name },
            { label: 'No HP', value: (row) => row.user.mobileNumber },
          ],
          content: data[17],
        });

      const buffer = xlsx(dataWillBePrinted, settings);
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-disposition': `attachment; filename=${fileName}.xlsx`,
      });
      res.end(buffer);
    } catch (error) {
      next(error);
    }
  }

  async getAllPlants(req, res, next) {
    try {
      let findData = {};

      req.query.createdAtStart &&
        (findData.createdAt = {
          $gte: new Date(req.query.createdAtStart),
        });
      req.query.createdAtEnd &&
        (findData.createdAt = {
          ...findData.createdAt,
          $lte: new Date(moment(req.query.createdAtEnd).add(1, 'days')),
        });
      req.query.farmer && (findData.farmer = req.query.farmer);
      req.query.vegetable && (findData.vegetable = req.query.vegetable);
      req.query.plantDateStart &&
        (findData.plantDate = {
          $gte: new Date(req.query.plantDateStart),
        });
      req.query.plantDateEnd &&
        (findData.plantDate = {
          ...findData.plantDate,
          $lte: new Date(moment(req.query.plantDateEnd).add(1, 'days')),
        });
      req.query.user && (findData.user = req.query.user);

      const data = await plant
        .find(findData)
        .populate('farmer')
        .populate('landArea')
        .populate('seedType')
        .populate('vegetable')
        .populate('user');

      if (data.length === 0) {
        return next({ message: 'Plants not found', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getOnePlant(req, res, next) {
    try {
      const data = await plant
        .findOne({ _id: req.params.id })
        .populate('farmer')
        .populate('landArea')
        .populate('seedType')
        .populate('vegetable')
        .populate('user');

      if (!data) {
        return next({ message: 'Plant not found', statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async createPlant(req, res, next) {
    try {
      let data = await plant.create(req.body);

      data = await plant
        .findOne({ _id: data._id })
        .populate('farmer')
        .populate('landArea')
        .populate('seedType')
        .populate('vegetable')
        .populate('user');

      if (!data) {
        return next({ message: 'Plant not found', statusCode: 404 });
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async updatePlant(req, res, next) {
    try {
      const data = await plant
        .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .populate('farmer')
        .populate('landArea')
        .populate('seedType')
        .populate('vegetable')
        .populate('user');

      if (!data) {
        return next({ message: 'Plant not found', statusCode: 404 });
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async deletePlant(req, res, next) {
    try {
      const data = await plant.deleteOne({ _id: req.params.id });

      if (data.deletedCount === 0) {
        return next({ message: 'Plant not found', statusCode: 404 });
      }

      res.status(200).json({ message: 'Plant has been deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Plants();
