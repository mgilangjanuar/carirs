(async () => {
  const { CariRS } = require('./dist')

  const provinces = [
    { id: '11prop', value: 'Aceh' },
    { id: '12prop', value: 'Sumatera Utara' },
    { id: '13prop', value: 'Sumatera Barat' },
    { id: '14prop', value: 'Riau' },
    { id: '15prop', value: 'Jambi' },
    { id: '16prop', value: 'Sumatera Selatan' },
    { id: '17prop', value: 'Bengkulu' },
    { id: '18prop', value: 'Lampung' },
    { id: '19prop', value: 'Kepulauan Bangka Belitung' },
    { id: '20prop', value: 'Kepulauan Riau' },
    { id: '31prop', value: 'DKI Jakarta' },
    { id: '32prop', value: 'Jawa Barat' },
    { id: '33prop', value: 'Jawa Tengah' },
    { id: '34prop', value: 'DI Yogyakarta' },
    { id: '35prop', value: 'Jawa Timur' },
    { id: '36prop', value: 'Banten' },
    { id: '51prop', value: 'Bali' },
    { id: '52prop', value: 'Nusa Tenggara Barat' },
    { id: '53prop', value: 'Nusa Tenggara Timur' },
    { id: '61prop', value: 'Kalimantan Barat' },
    { id: '62prop', value: 'Kalimantan Tengah' },
    { id: '63prop', value: 'Kalimantan Selatan' },
    { id: '64prop', value: 'Kalimantan Timur' },
    { id: '65prop', value: 'Kalimantan Utara' },
    { id: '71prop', value: 'Sulawesi Utara' },
    { id: '72prop', value: 'Sulawesi Tengah' },
    { id: '73prop', value: 'Sulawesi Selatan' },
    { id: '74prop', value: 'Sulawesi Tenggara' },
    { id: '75prop', value: 'Gorontalo' },
    { id: '76prop', value: 'Sulawesi Barat' },
    { id: '81prop', value: 'Maluku' },
    { id: '82prop', value: 'Maluku Utara' },
    { id: '91prop', value: 'Papua Barat' },
    { id: '92prop', value: 'Papua' }
  ]

  const cariRS = new CariRS()

  let results = []
  for (const prov of provinces) {
    for (const city of (await cariRS.getCities(prov.id)).cities) {
      const hospital = await cariRS.getHospitals('covid', prov.id, city.id)
      results = [...results, ...hospital.hospitals.map(hosp => ({ ...hosp, tags: ['covid'], province: prov, city: city })) || []]

      const hospital2 = await cariRS.getHospitals('noncovid', prov.id, city.id)
      results = [...results, ...hospital2.hospitals.map(hosp => {
        if (results.find(res => res.id === hosp.id)) {
          results = results.map(res => {
            if (res.id === hosp.id) {
              res.tags.push('noncovid')
              return res
            }
            return res
          })
          return null
        }
        return { ...hosp, tags: ['noncovid'], province: prov, city: city }
      }).filter(Boolean) || []]
    }
  }
  const finaldata = results.map(hosp => ({ tags: hosp.tags, id: hosp.id, name: hosp.name, address: hosp.address, phoneNumber: hosp.phoneNumber, province: hosp.province, city: hosp.city }))
  console.log(JSON.stringify(finaldata))


  // let results = []
  // for (const prov of provinces) {
  //   results = [...results, { ...prov, cities: (await cariRS.getCities(prov.id)).cities }]
  // }
  // console.log(JSON.stringify(results))
})()