import axios from 'axios'
import scrapeIt from 'scrape-it'
import cities from './data/cities.json'
import hospitals from './data/hospitals.json'
import provinces from './data/provinces.json'

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
    province?: {
      id: string,
      value: string
    },
    city?: {
      id: string,
      value: string
    },
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
  private static BED_TYPES = {
    covid: 1,
    noncovid: 2
  }

  constructor(private url = 'http://yankes.kemkes.go.id/app/siranap') {}

  public getProvinces(): Province {
    return { provinces: provinces }
  }

  public findProvinces(name: string): Province {
    return { provinces: provinces.filter(prov => prov.value.match(new RegExp(name, 'gi'))) }
  }

  public getCities(provinceId: string): City {
    return {
      cities: cities.find(data => data.id === provinceId).cities
    }
  }

  public findCities(name: string): City {
    return {
      cities: cities.reduce((res, prov) => [...res, ...prov.cities.filter(city => city.value.match(new RegExp(name, 'gi')))], [])
    }
  }

  public async getHospitals(type: 'covid' | 'noncovid', provinceId?: string, cityId?: string): Promise<Hospital> {
    try {
      const { data } = await scrapeIt<Hospital>(`${this.url}/rumah_sakit?jenis=${CariRS.BED_TYPES[type]}&propinsi=${provinceId}&kabkota=${cityId || ''}`, {
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
    } catch (error) {
      const match = hospital => {
        let result = hospital.tags.includes(type)
        if (provinceId) {
          result = result && hospital.province.id === provinceId
        }
        if (cityId) {
          result = result && hospital.city.id === cityId
        }
        return result
      }
      return { hospitals: hospitals.filter(match) }
    }
  }

  public findHospitals(name: string, type?: 'covid' | 'noncovid'): Hospital {
    const match = hospital => {
      const result = hospital.name.match(new RegExp(name, 'gi'))
                  || hospital.address.match(new RegExp(name, 'gi'))
                  || hospital.province.value.match(new RegExp(name, 'gi'))
                  || hospital.city.value.match(new RegExp(name, 'gi'))
      if (type) {
        return result && hospital.tags.includes(type)
      }
      return result
    }
    return { hospitals: hospitals.filter(match) }
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
    const { data } = await scrapeIt<BedDetails>(`${this.url}/tempat_tidur?jenis=${CariRS.BED_TYPES[type]}&kode_rs=${hospitalId}`, {
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