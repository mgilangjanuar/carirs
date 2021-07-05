const { CariRS } = require('./dist')

const cariRS = new CariRS()
cariRS.getProvinces()
  .then(data => {
    // {
    //   provinces: [
    //     { id: '11prop', value: 'Aceh' },
    //     { id: '12prop', value: 'Sumatera Utara' },
    //     { id: '13prop', value: 'Sumatera Barat' },
    //     { id: '14prop', value: 'R I A U' }
    //     ...
    console.log(data)
  })
  .catch(err => console.error(err))

cariRS.getCities('31prop')
  .then(data => {
    // {
    //   cities: [
    //     { id: '3101', value: 'Kepulauan Seribu' },
    //     { id: '3171', value: 'Kota Jakarta Selatan' },
    //     { id: '3172', value: 'Kota Jakarta Timur' },
    //     { id: '3173', value: 'Kota Jakarta Pusat' },
    //     { id: '3174', value: 'Kota Jakarta Barat' }
    //     ...
    console.log(data)
  })
  .catch(err => console.error(err))

cariRS.getHospitals('covid', '31prop', '3171')
  .then(data => {
    // {
    //   hospitals: [
    //     {
    //       id: '3171072',
    //       name: 'RS Umum Dr. Suyoto Pusrehab Kemhan',
    //       address: 'Jl. RC. Veteran No. 178 Bintaro',
    //       availableRoom: 6,
    //       info: 'diupdate 9 jam yang lalu',
    //       phoneNumber: '0217342012'
    //     },
    //     {
    //       id: '3171045',
    //       name: 'RS Umum Jakarta',
    //       address: 'Jl. Jend.Sudirman Kav.49,Jaksel',
    //       availableRoom: 4,
    //       info: 'diupdate 9 jam yang lalu',
    //       phoneNumber: null
    //     },
    //     {
    //       id: '3171784',
    //       name: 'RS Umum Yadika',
    //       address: 'Jl. Ciputat Raya No. 5',
    //       availableRoom: 2,
    //       info: 'diupdate 7 jam yang lalu',
    //       phoneNumber: null
    //     }
    //    ...
    console.log(data)
  })
  .catch(err => console.error(err))