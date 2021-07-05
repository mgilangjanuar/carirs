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

export class CariRS {
  constructor(private url = 'http://yankes.kemkes.go.id/app/siranap') {}

  public async getProvinces(): Promise<Province> {
    const { data } = await scrapeIt<Province>(`${this.url}/wilayah?jenis=1`, {
      provinces: {
        listItem: '#propinsi > option',
        data: {
          id: { attr: 'value' },
          value: {}
        }
      }
    })
    return {
      provinces: data.provinces?.filter((_, i) => i > 0)
    }
  }

  public async getCities(provinceId: string): Promise<City> {
    const { data } = await axios.get(`${this.url}/Kabkota?kode_propinsi=${provinceId}`)
    return {
      cities: data.data.map(city => ({ id: city.kode_kabkota, value: city.nama_kabkota }))
    }
  }

  public async getHospitals(type: 'covid' | 'noncovid', provinceId: string, cityId: string): Promise<Hospital> {
    const { data } = await scrapeIt<Hospital>(`${this.url}/rumah_sakit?jenis=${type === 'covid' ? '1' : '2'}&propinsi=${provinceId}&kabkota=${cityId}`, {
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
}