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

cariRS.getHospitals('noncovid', '31prop', '3171')
  .then(data => {
    console.log(data)
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

cariRS.getBedDetails('covid', '3171515')
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
```

## Available Methods

- **getProvinces()**

  *return* `Promise<{ provinces: { id: string, value: string }[] }>`

- **getCities(provinceId: string)**

  *return* `Promise<{ cities: { id: string, value: string }[] }>`

- **getHospitals(type: covid | noncovid, provinceId?: string, cityId?: string)**

  *return* `Promise<{
    hospitals: {
      id: string,
      name: string,
      address: string,
      queue?: number,
      info?: string,
      phoneNumber?: string,
      availableRoom?: number,
      availableRooms?: {
        name: string,
        available: number,
        info?: string
      }[]
    }[]
  }>`

- **getBedDetails(type: covid | noncovid, hospitalId: string)**

  *return* `Promise<{
    bedDetails: {
    updatedTime: string,
    title: string,
    total: number,
    available: number,
    queue?: number
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


### v0.2.0

- **findProvinces(keyword: string)**

  *return* `Promise<{ provinces: { id: string, value: string }[] }>`

- **findCities(keyword: string)**

  *return* `Promise<{ cities: { id: string, value: string }[] }>`

- **findHospitals(keyword: string, type?: covid | noncovid)**

  *return* `Promise<{
    hospitals: {
      id: string,
      name: string,
      address: string,
      phoneNumber?: string,
      tags?: ('covid' | 'noncovid')[],
      province?: {
        id: string,
        value: string
      },
      city?: {
        id: string,
        value: string
      },
    }[]
  }>`

## License

[MIT](./LICENSE.md)

![high-five](https://media0.giphy.com/media/26BREWfA5cRZJbMd2/giphy.gif?cid=ecf05e4721370e49dc41cdc59e140f4c0337fcaa46553ddb&rid=giphy.gif)