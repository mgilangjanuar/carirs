# carirs

Getting hospitals availability data from Kementerian Kesehatan Republik Indonesia.

## Installation

```shell
$ npm i carirs -S

// or with yarn

$ yarn add carirs -S
```

## Example

```js
const { CariRS } = require('carirs')

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

cariRS.getHospitals('covid', '31prop', '3171')
  .then(data => {
    console.log(data)
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

cariRS.getBedDetails('covid', '3171515')
  .then(data => {
    console.log(data)
    // {
    //   bedDetails: [
    //     {
    //       updatedTime: '05-07-2021 08:26:51',
    //       title: 'ICU Tekanan Negatif dengan Ventilator',
    //       total: 4,
    //       available: 0
    //     },
    //     {
    //       updatedTime: '05-07-2021 08:35:31',
    //       title: 'Isolasi Tekanan Negatif',
    //       total: 85,
    //       available: 3
    //     },
    //     ...
    //   ]
    // }
  })
  .catch(err => console.error(err))
```

## Available Methods

- **getProvinces()**

  *return* `Promise<{ provinces: { id: string, value: string }[] }>`

- **getCities(provinceId: string)**

  *return* `Promise<{ cities: { id: string, value: string }[] }>`

- **getHospitals(type: covid | noncovid, provinceId: string, cityId: string)**

  *return* `Promise<{
    hospitals: {
      id: string,
      name: string,
      address: string,
      availableRoom?: number,
      info?: string,
      phoneNumber?: string
    }
  }>`

- **getBedDetails(type: covid | noncovid, hospitalId: string)**

  *return* `Promise<{
    bedDetails: {
      updatedTime: string,
      title: string,
      total: number,
      available: number
    }[]
  }>`

- **getMaps(hospitalId: string)**

  *return* `Promise<{
    maps: {
      url: string,
      urlAlt1: string,
      urlAlt2: string,
      lat: number,
      long: number
    }
  }>`

## License

[MIT](./LICENSE.md)

![high-five](https://media0.giphy.com/media/26BREWfA5cRZJbMd2/giphy.gif?cid=ecf05e4721370e49dc41cdc59e140f4c0337fcaa46553ddb&rid=giphy.gif)