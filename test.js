const { CariRS } = require('./dist')

const cariRS = new CariRS()
cariRS.getProvinces()
  .then(data => {
    console.log(data)
    // {
    //   provinces: [
    //     { id: '11prop', value: 'Aceh' },
    //     { id: '12prop', value: 'Sumatera Utara' },
    //     { id: '13prop', value: 'Sumatera Barat' },
    //     { id: '14prop', value: 'R I A U' }
    //     ...
  })
  .catch(err => console.error(err))

cariRS.getCities('31prop')
  .then(data => {
    console.log(data)
    // {
    //   cities: [
    //     { id: '3101', value: 'Kepulauan Seribu' },
    //     { id: '3171', value: 'Kota Jakarta Selatan' },
    //     { id: '3172', value: 'Kota Jakarta Timur' },
    //     { id: '3173', value: 'Kota Jakarta Pusat' },
    //     { id: '3174', value: 'Kota Jakarta Barat' }
    //     ...
  })
  .catch(err => console.error(err))

cariRS.getHospitals('noncovid', '31prop', '3171')
  .then(data => {
    console.log(JSON.stringify(data, null, 2))
    // {
    //   hospitals: [
    //     {
    //       "id": "3171012",
    //       "name": "RSUP Fatmawati",
    //       "phoneNumber": "021 7501524 / 7660552",
    //       "address": "Jl. RS Fatmawati Cilandak,Jaksel",
    //       "availableRooms": [
    //         {
    //           "available": 4,
    //           "name": "Bed Kosong Kelas I",
    //           "info": "diupdate kurang dari 1 menit yang lalu"
    //         },
    //         {
    //           "available": 9,
    //           "name": "Bed Kosong Kelas II",
    //           "info": "diupdate kurang dari 1 menit yang lalu"
    //         },
    //         {
    //           "available": 17,
    //           "name": "Bed Kosong Kelas III",
    //           "info": "diupdate kurang dari 1 menit yang lalu"
    //         }
    //       ]
    //     }
    //     ...
    //   ]
    // }
  })
  .catch(err => console.error(err))

cariRS.getMaps('3171045')
  .then(data => {
    console.log(data)
    // {
    //   maps: {
    //     url: 'https://www.google.com/maps/search/?api=1&query=RS%20Umum%20Jakarta',
    //     urlAlt1: 'https://www.google.com/maps/search/?api=1&query=Jl.%20Jend.Sudirman%20Kav.49%2CJaksel',
    //     urlAlt2: 'https://www.google.com/maps/search/?api=1&query=-6.2272,106.802',
    //     lat: -6.2272,
    //     long: 106.802
    //   }
    // }
  })
  .catch(err => console.error(err))

cariRS.getBedDetails('covid', '3171072')
  .then(data => {
    console.log(data)
    // {
    //   bedDetails: [
    //     {
    //       updatedTime: '05-07-2021 08:26:51',
    //       title: 'ICU Tekanan Negatif dengan Ventilator',
    //       total: 54,
    //       available: 0
    //       queue: 4
    //     },
    //     {
    //       updatedTime: '05-07-2021 08:35:31',
    //       title: 'Isolasi Tekanan Negatif',
    //       total: 85,
    //       available: 3
    //       queue: undefined
    //     },
    //     ...
    //   ]
    // }
  })
  .catch(err => console.error(err))