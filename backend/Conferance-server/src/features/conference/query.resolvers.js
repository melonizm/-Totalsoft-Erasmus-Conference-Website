const { prisma } = require('../../prisma')
const { map } = require('ramda')

const conferenceQueryResolvers = {
  Query: {
    conferenceList: async (_parent, { filters, userEmail }, _ctx, _info) => {
      let where = {}
      
      // İsim filtresi - case insensitive arama (SQL Server için)
      if (filters?.name && filters.name.trim() !== '') {
        where.name = { contains: filters.name.trim() }
      }
      
      // Tarih filtreleri - düzeltilmiş mantık
      if (filters?.startDate) {
        where.startDate = { gte: new Date(filters.startDate) }
      }
      if (filters?.endDate) {
        where.endDate = { lte: new Date(filters.endDate) }
      }

      console.log('Conference filters:', filters)
      console.log('Where clause:', where)

      return prisma().conference.findMany({ where })
    },
    conference: async (_parent, { id }, _ctx, _info) => {
      return prisma().conference.findUnique({ where: { id: Number(id) } })
    },
    isConferenceTypeExists: async (_parent, { name }) => {
      const type = await prisma().dictionaryConferenceType.findFirst({ where: { name } })
      return !!type
    },
    isCategoryExists: async (_parent, { name }) => {
      const category = await prisma().dictionaryCategory.findFirst({ where: { name } })
      return !!category
    },
    isCountryExists: async (_parent, { name }) => {
      const country = await prisma().dictionaryCountry.findFirst({ where: { name } })
      return !!country
    },
    isCountyExists: async (_parent, { name }) => {
      const county = await prisma().dictionaryCounty.findFirst({ where: { name } })
      return !!county
    },
    isCityExists: async (_parent, { name }) => {
      const city = await prisma().dictionaryCity.findFirst({ where: { name } })
      return !!city
    },
    countryList: async () => {
      return prisma().dictionaryCountry.findMany({})
    },
    countyList: async () => {
      return prisma().dictionaryCounty.findMany({})
    },
    cityList: async () => {
      return prisma().dictionaryCity.findMany({})
    },
    conferenceTypeList: async () => {
      return prisma().dictionaryConferenceType.findMany({})
    },
    categoryList: async () => {
      return prisma().dictionaryCategory.findMany({})
    }
  },
  Conference: {
    conferenceType: ({ conferenceTypeId }) =>
      conferenceTypeId ? prisma().dictionaryConferenceType.findUnique({ where: { id: conferenceTypeId } }) : { id: 0, name: 'conferenceType' },
    category: ({ categoryId }) =>
      categoryId ? prisma().dictionaryCategory.findUnique({ where: { id: categoryId } }) : { id: 0, name: 'category' },
    location: ({ locationId }) => {
      if (locationId == null) return { id: 0, name: 'location' };
      return prisma().location.findUnique({ where: { id: locationId } })
    },
    speakers: async ({ id }) => {
      const result = await prisma()
        .conference.findUnique({ where: { id } })
        .conferenceXSpeaker({ include: { speaker: true } })

      return map(({ speaker, isMainSpeaker }) => ({ ...speaker, isMainSpeaker }), result)
    },
    status: async ({ id }, { userEmail }) => {
      const result = await prisma().conferenceXAttendee.findUnique({
        where: {
          conferenceId_attendeeEmail: {
            conferenceId: id,
            attendeeEmail: userEmail
          }
        },
        include: { dictionaryStatus: true }
      })

      return result?.dictionaryStatus
    }
  },
  Location: {
    city: ({ cityId }) => cityId ? prisma().dictionaryCity.findUnique({ where: { id: cityId } }) : { id: 0, name: 'city' },
    county: ({ countyId }) => countyId ? prisma().dictionaryCounty.findUnique({ where: { id: countyId } }) : { id: 0, name: 'county' },
    country: ({ countryId }) => countryId ? prisma().dictionaryCountry.findUnique({ where: { id: countryId } }) : { id: 0, name: 'country' }
  }
}

module.exports = conferenceQueryResolvers
