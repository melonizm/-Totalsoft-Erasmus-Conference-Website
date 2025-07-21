const { prisma } = require('../../prisma')

// Helper functions for dictionary tables
async function createOrGetCountry(name, code) {
  let country = await prisma().dictionaryCountry.findFirst({ where: { name } })
  if (!country) {
    country = await prisma().dictionaryCountry.create({ data: { name, code } })
  }
  return country.id
}

async function createOrGetCounty(name, code) {
  let county = await prisma().dictionaryCounty.findFirst({ where: { name } })
  if (!county) {
    county = await prisma().dictionaryCounty.create({ data: { name, code } })
  }
  return county.id
}

async function createOrGetCity(name, code) {
  let city = await prisma().dictionaryCity.findFirst({ where: { name } })
  if (!city) {
    city = await prisma().dictionaryCity.create({ data: { name, code } })
  }
  return city.id
}

async function createOrGetConferenceType(name, code) {
  let type = await prisma().dictionaryConferenceType.findFirst({ where: { name } })
  if (!type) {
    type = await prisma().dictionaryConferenceType.create({ data: { name, code } })
  }
  return type.id
}

async function createOrGetCategory(name, code) {
  let category = await prisma().dictionaryCategory.findFirst({ where: { name } })
  if (!category) {
    category = await prisma().dictionaryCategory.create({ data: { name, code } })
  }
  return category.id
}

async function createOrGetSpeaker(name, nationality, rating, image) {
  let speaker = await prisma().speaker.findFirst({ where: { name } })
  if (!speaker) {
    speaker = await prisma().speaker.create({ data: { name, nationality, rating, image } })
  }
  return speaker.id
}

const conferenceMutationResolvers = {
  Mutation: {
    saveConference: async (_parent, { conference }, _ctx, _info) => {
      let {
        id,
        name,
        startDate,
        endDate,
        organizerEmail,
        location,
        speakers,
        type,
        category
      } = conference

      // ConferenceType ve Category id'lerini tek seferde tanımla
      let conferenceTypeId = conference.conferenceTypeId
      if ((!conferenceTypeId || conferenceTypeId === null) && type && type.name) {
        conferenceTypeId = await createOrGetConferenceType(type.name, type.code)
      }
      let categoryId = conference.categoryId
      if ((!categoryId || categoryId === null) && category && category.name) {
        categoryId = await createOrGetCategory(category.name, category.code)
      }

      // Location foreign keys
      let countryId = location.countryId
      if ((!countryId || countryId === null) && location.country && location.country.name) {
        countryId = await createOrGetCountry(location.country.name, location.country.code)
      }
      let countyId = location.countyId
      if ((!countyId || countyId === null) && location.county && location.county.name) {
        countyId = await createOrGetCounty(location.county.name, location.county.code)
      }
      let cityId = location.cityId
      if ((!cityId || cityId === null) && location.city && location.city.name) {
        cityId = await createOrGetCity(location.city.name, location.city.code)
      }
      // cityId, countyId, countryId kesinlikle ya null ya da Dictionary tablosunda var olan id olmalı

      // location insert/update
      let locationId = location.id
      if (!locationId) {
        const newLocation = await prisma().location.create({
          data: {
            name: location.name,
            address: location.address,
            cityId: cityId || null,
            countyId: countyId || null,
            countryId: countryId || null,
            latitude: location.latitude,
            longitude: location.longitude
          }
        })
        locationId = newLocation.id
      }

      // upsert conference
      const savedConference = await prisma().conference.upsert({
        where: { id: id || 0 },
        update: {
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          conferenceTypeId,
          categoryId,
          organizerEmail,
          locationId
        },
        create: {
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          conferenceTypeId,
          categoryId,
          organizerEmail,
          locationId
        }
      })

      // delete previous speakers if update
      if (id) {
        await prisma().conferenceXSpeaker.deleteMany({
          where: { conferenceId: savedConference.id }
        })
      }

      // insert speakers (ensure speaker exists)
      for (const s of speakers) {
        let speakerId = s.id
        if (!speakerId || speakerId < 1) {
          speakerId = await createOrGetSpeaker(s.name, s.nationality, s.rating, s.image)
        }
        await prisma().conferenceXSpeaker.create({
          data: {
            conferenceId: savedConference.id,
            speakerId,
            isMainSpeaker: s.isMainSpeaker
          }
        })
      }

      return savedConference
    },

    deleteConference: async (_parent, { id }, _ctx, _info) => {
      // Get conference details before deleting
      const conference = await prisma().conference.findUnique({ where: { id } })
      const locationId = conference?.locationId
      // Get all related speakerIds from conferenceXSpeaker
      const conferenceXSpeakers = await prisma().conferenceXSpeaker.findMany({ where: { conferenceId: id } })
      const speakerIds = conferenceXSpeakers.map(cs => cs.speakerId)
      await prisma().conferenceXSpeaker.deleteMany({ where: { conferenceId: id } })
      await prisma().conferenceXAttendee.deleteMany({ where: { conferenceId: id } })
      await prisma().conference.delete({ where: { id } })
      // Delete location if not used by any other conference
      if (locationId) {
        const other = await prisma().conference.findFirst({ where: { locationId } })
        if (!other) {
          await prisma().location.delete({ where: { id: locationId } })
        }
      }
      // Delete speakers if not used by any other conference
      for (const speakerId of speakerIds) {
        const other = await prisma().conferenceXSpeaker.findFirst({ where: { speakerId } })
        if (!other) {
          await prisma().speaker.delete({ where: { id: speakerId } })
        }
      }
      return true
    },
    addCountry: async (_parent, { name, code }) => {
      try {
        await prisma().dictionaryCountry.create({ data: { name, code } })
        return true
      } catch (e) {
        return false
      }
    },
    addCounty: async (_parent, { name, code }) => {
      try {
        await prisma().dictionaryCounty.create({ data: { name, code } })
        return true
      } catch (e) {
        return false
      }
    },
    addCity: async (_parent, { name, code }) => {
      try {
        await prisma().dictionaryCity.create({ data: { name, code } })
        return true
      } catch (e) {
        return false
      }
    },
    addConferenceType: async (_parent, { name, code }) => {
      try {
        await prisma().dictionaryConferenceType.create({ data: { name, code } })
        return true
      } catch (e) {
        return false
      }
    },
    addCategory: async (_parent, { name, code }) => {
      try {
        await prisma().dictionaryCategory.create({ data: { name, code } })
        return true
      } catch (e) {
        return false
      }
    }
  }
}

module.exports = conferenceMutationResolvers
