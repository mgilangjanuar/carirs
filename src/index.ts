import axios from 'axios'
import scrapeIt from 'scrape-it'

interface Province {
  provinces: { id: string, value: string }[]
}

interface City {
  cities: { id: string, value: string }[]
}

interface Hospital {
  hospitals: {
    id: string,
    name: string,
    address: string,
    availableRoom?: number,
    info?: string,
    phoneNumber?: string
  }[]
}

interface Maps {
  maps: {
    url: string,
    urlAlt: string,
    lat: number,
    long: number
  }
}

interface BedDetails {
  bedDetails: {
    updatedTime: string,
    title: string,
    total: number,
    available: number
  }[]
}

export class CariRS {
  private bedTypes = {
    covid: 1,
    noncovid: 2
  }

  constructor(private url = 'http://yankes.kemkes.go.id/app/siranap') {}

  public async getProvinces(): Promise<Province> {
    return {
      provinces: [
        { id: '11prop', value: 'Aceh' },
        { id: '12prop', value: 'Sumatera Utara' },
        { id: '13prop', value: 'Sumatera Barat' },
        { id: '14prop', value: 'R I A U' },
        { id: '15prop', value: 'Jambi' },
        { id: '16prop', value: 'Sumatera Selatan' },
        { id: '17prop', value: 'Bengkulu' },
        { id: '18prop', value: 'Lampung' },
        { id: '19prop', value: 'Kepulauan Bangka Belitung' },
        { id: '20prop', value: 'Kepulauan Riau' },
        { id: '31prop', value: 'Dki Jakarta' },
        { id: '32prop', value: 'Jawa Barat' },
        { id: '33prop', value: 'Jawa Tengah' },
        { id: '34prop', value: 'D I Yogyakarta' },
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
    }
    // const { data } = await scrapeIt<Province>(`${this.url}/wilayah?jenis=1`, {
    //   provinces: {
    //     listItem: '#propinsi > option',
    //     data: {
    //       id: { attr: 'value' },
    //       value: {}
    //     }
    //   }
    // })
    // return {
    //   provinces: data.provinces?.filter((_, i) => i > 0)
    // }
  }

  public async getCities(provinceId: string): Promise<City> {
    const { data } = await axios.get(`${this.url}/Kabkota?kode_propinsi=${provinceId}`)
    return {
      cities: data.data.map(city => ({ id: city.kode_kabkota, value: city.nama_kabkota }))
    }
  }

  public async getHospitals(type: 'covid' | 'noncovid', provinceId: string, cityId: string): Promise<Hospital> {
    const { data } = await scrapeIt<Hospital>(`${this.url}/rumah_sakit?jenis=${this.bedTypes[type]}&propinsi=${provinceId}&kabkota=${cityId}`, {
      hospitals: {
        listItem: '.row > .cardRS',
        data: type === 'covid' ? {
          id: {
            selector: '.card-body .col-md-5 > .text-right > a',
            attr: 'href'
          },
          name: { attr: 'data-string' },
          address: '.card-body .col-md-7 > p',
          availableRoom: {
            selector: '.card-body .col-md-5 > .mt-2.text-right > p',
            eq: 0
          },
          info: {
            selector: '.card-body .col-md-5 > .mt-2.text-right > p',
            eq: 2
          },
          phoneNumber: {
            selector: '.card-body .col-md-5 > .mt-2.text-right > p',
            eq: 3
          }
        } : {
          id: {
            selector: '.card-body > div.d-inline > a',
            attr: 'href',
            eq: 1
          },
          name: { attr: 'data-string' },
          address: {
            selector: '.card-body > p.mb-0',
            how: 'html'
          },
          phoneNumber: {
            selector: '.card-body > p.mb-0',
            how: 'html'
          }
        }
      }
    })
    return {
      hospitals: data.hospitals?.map(hospital => ({
        ...hospital,
        ...type === 'covid' ? {
          id: hospital.id.replace(/^.*kode_rs=/gi, '').replace(/\&.*=\d*/gi, ''),
          availableRoom: Number(hospital.availableRoom.toString().replace(/[^\d]/gi, '') || '0'),
          phoneNumber: hospital.phoneNumber.toString().replace(/[^\d]/gi, '') || null,
          info: hospital.info.replace(/\./gi, '')
        } : {
          id: hospital.id.replace(/^.*kode_rs=/gi, '').replace(/\&.*=\d*/gi, ''),
          address: hospital.address.split('<br>')?.[0] || null,
          phoneNumber: hospital.phoneNumber.split('<br>')?.[1] || null,
        }
      }))
    }
  }

  public async getMaps(hospitalId: string): Promise<Maps> {
    const { data: dataResp } = await axios.get(`http://yankes.kemkes.go.id/app/siranap/rumah_sakit/${hospitalId}`)
    const { data } = dataResp
    return {
      maps: {
        url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.RUMAH_SAKIT)}`,
        urlAlt: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.ALAMAT)}`,
        lat: Number(data.alt),
        long: Number(data.long)
      }
    }
  }

  public async getBedDetails(type: 'covid' | 'noncovid', hospitalId: string): Promise<BedDetails> {
    const { data } = await scrapeIt<BedDetails>(`${this.url}/tempat_tidur?jenis=${this.bedTypes[type]}&kode_rs=${hospitalId}`, {
      bedDetails: {
        listItem: '.row > .col-md-4.mb-3',
        data: {
          updatedTime: '.card-header > div > .ml-auto.mt-1',
          title: '.card-body > h5',
          total: {
            selector: '.card-body > .col-md-12 .col-4 div h1',
            eq: 0
          },
          available: {
            selector: '.card-body > .col-md-12 .col-4 div h1',
            eq: 1
          }
        }
      }
    })
    return {
      bedDetails: data.bedDetails.map(bed => ({
        ...bed,
        total: Number(bed.total),
        available: Number(bed.available)
      }))
    }
  }
}