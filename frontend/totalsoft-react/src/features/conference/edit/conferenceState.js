import { modify, append, remove } from 'ramda'
import { emptyString, emptyArray } from 'utils/constants'
import { modifyPath } from 'utils/functions' // ✅ Bu fonksiyon tanımlı olmalı

export const initialConference = {
  name: emptyString,
  startDate: null,
  endDate: null,
  location: {
    name: emptyString,
    address: emptyString,
    country: null,
    county: null,
    city: null,
    latitude: emptyString,
    longitude: emptyString
  },
  speakers: emptyArray,
  type: null,
  category: null,
  deletedSpeakers: emptyArray
}

export const reducer = (state, action) => {
  switch (action.type) {
    // Üst seviye alanlar
    case 'name':
    case 'startDate':
    case 'endDate':
    case 'type':
    case 'category':
      return { ...state, [action.type]: action.payload }
    case 'resetData':
        return { deletedSpeakers: emptyArray, ...action.payload }
    // Location alanları
    case 'locationName':
      return { ...state, location: { ...state.location, name: action.payload } }
    case 'address':
    case 'country':
    case 'county':
    case 'city':
    case 'latitude':
    case 'longitude':
      return {
        ...state,
        location: {
          ...state.location,
          [action.type]: action.payload
        }
      }

    // Speaker alanları
    case 'speakerName':
      return modifyPath(['speakers', action.index, 'name'], () => action.payload, state)
    case 'nationality':
    case 'rating':
    case 'isMainSpeaker':
      return modifyPath(['speakers', action.index, action.type], () => action.payload, state)

    // Speaker silme
    case 'deleteSpeaker':
      return {
        ...state,
        speakers: remove(action.index, 1, state.speakers),
        deletedSpeakers:
          state.speakers[action.index].id > 0
            ? [...state.deletedSpeakers, state.speakers[action.index].id]
            : state.deletedSpeakers
      }

    // Speaker ekleme
    case 'addSpeaker': {
      const minSpeakerId = Math.min(...state.speakers.map(s => s.id), 0)
      return modify(
        'speakers',
        append({
          id: minSpeakerId - 1,
          name: emptyString,
          nationality: emptyString,
          rating: emptyString,
          isMainSpeaker: false
        }),
        state
      )
    }

    // Varsayılan
    default:
      return state
  }
}
