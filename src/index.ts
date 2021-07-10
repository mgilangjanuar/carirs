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
}

interface Maps {
  maps: {
    url: string,
    urlAlt1: string,
    urlAlt2: string,
    lat: number,
    long: number
  }
}

interface BedDetails {
  bedDetails: {
    updatedTime: string,
    title: string,
    total: number,
    available: number,
    queue?: number
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
    }
  }

  public async getCities(provinceId: string): Promise<City> {
    const { data } = await axios.get(`${this.url}/Kabkota?kode_propinsi=${provinceId}`)
    return {
      cities: data.data.map(city => ({ id: city.kode_kabkota, value: city.nama_kabkota }))
    }
  }

  public async getHospitals(type: 'covid' | 'noncovid', provinceId: string, cityId?: string): Promise<Hospital> {
    const { data } = await scrapeIt<Hospital>(`${this.url}/rumah_sakit?jenis=${this.bedTypes[type]}&propinsi=${provinceId}&kabkota=${cityId || ''}`, {
      hospitals: {
        listItem: '.row > .cardRS',
        data: {
          id: {
            selector: '.card-footer > div > a',
            attr: 'href'
          },
          name: { attr: 'data-string' },
          phoneNumber: {
            selector: '.card-footer > div > span',
            eq: 0
          },
          ...type === 'covid' ? {
            address: '.card-body .col-md-7 > p',
            availableRoom: {
              selector: '.card-body .col-md-5 > p',
              eq: 1
            },
            queue: {
              selector: '.card-body .col-md-5 > p',
              eq: 2
            },
            info: {
              selector: '.card-body .col-md-5 > p',
              eq: 3
            },
          } : {
            address: '.card-body .col-md-5 > p.mb-0',
            availableRooms: {
              listItem: '.card-body .col-md-7 .col-md-4',
              data: {
                available: {
                  selector: '.card-body > div',
                  eq: 0
                },
                name: {
                  selector: '.card-body > div',
                  eq: 1
                },
                info: '.card-footer > div'
              }
            }
          }
        }
      }
    })
    return {
      hospitals: data.hospitals?.map((hospital: any) => ({
        ...hospital,
        ...type === 'covid' ? {
          id: hospital.id.replace(/^.*kode_rs=/gi, '').replace(/\&.*=\d*/gi, ''),
          availableRoom: Number(hospital.availableRoom.toString().replace(/[^\d]/gi, '') || '0'),
          queue: Number(hospital.queue.toString().replace(/[^\d]/gi, '') || '0'),
          phoneNumber: hospital.phoneNumber.toString().replace(/[^\d\s\/]/gi, '').replace(/^\s*|\s*$/gi, '') || null,
          info: hospital.info.replace(/\./gi, '')
        } : {
          id: hospital.id.replace(/^.*kode_rs=/gi, '').replace(/\&.*=\d*/gi, ''),
          phoneNumber: hospital.phoneNumber.toString().replace(/[^\d\s\/]/gi, '').replace(/^\s*|\s*$/gi, '') || null,
          availableRooms: hospital.availableRooms?.map(bed => ({ ...bed, available: Number(bed.available) }))
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
        urlAlt1: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.ALAMAT)}`,
        urlAlt2: `https://www.google.com/maps/search/?api=1&query=${data.alt},${data.long}`,
        lat: Number(data.alt),
        long: Number(data.long)
      }
    }
  }

  public async getBedDetails(type: 'covid' | 'noncovid', hospitalId: string): Promise<BedDetails> {
    const { data } = await scrapeIt<BedDetails>(`${this.url}/tempat_tidur?jenis=${this.bedTypes[type]}&kode_rs=${hospitalId}`, {
      bedDetails: {
        listItem: '.container .row > .col-md-12.mb-2',
        data: {
          updatedTime: {
            selector: '.card-body > .row > .col-md-6 > p > small'
          },
          title: {
            selector: '.card-body > .row > .col-md-6 > p',
            how: 'html'
          },
          total: {
            selector: '.card-body .col-md-6 > .row.pt-2.pt-md-0 > .col-md-4.col-4',
            eq: 0
          },
          available: {
            selector: '.card-body .col-md-6 > .row.pt-2.pt-md-0 > .col-md-4.col-4',
            eq: 1
          },
          queue: {
            selector: '.card-body .col-md-6 > .row.pt-2.pt-md-0 > .col-md-4.col-4',
            eq: 2
          }
        }
      }
    })
    return {
      bedDetails: data.bedDetails.map(bed => ({
        ...bed,
        title: bed.title?.split('<br>')[0].replace(/^\s*|\s*$/gi, ''),
        updatedTime: bed.updatedTime?.replace(/Update\ /gi, ''),
        total: Number(bed.total.toString().replace(/[^\d]/gi, '') || '0'),
        available: Number(bed.available.toString().replace(/[^\d]/gi, '') || '0'),
        queue: bed.queue ? Number(bed.queue.toString().replace(/[^\d]/gi, '')) : undefined
      }))
    }
  }
}