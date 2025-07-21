import React, { useEffect, useReducer, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHeader } from 'providers/AreasProvider'
import ConferenceHeader from 'features/conference/list/components/ConferenceHeader.jsx'
import Conference from '../../list/components/Conference.jsx'
import ConferenceInfo from 'features/conference/list/components/ConferenceInfo.jsx'
import ConferenceLocation from 'features/conference/list/components/ConferenceLocation.jsx'
import ConferenceSpeakers from 'features/conference/list/components/ConferenceSpeakers.jsx'
import { types, categories, countries, counties, cities } from 'utils/mocks/dictionaries'
import { FakeText, IconButton, Card, Button } from '@totalsoft/rocket-ui'
import { useParams, useNavigate } from 'react-router-dom'
import { initialConference, reducer } from '../conferenceState.js'
import { useQuery, useMutation, gql } from '@apollo/client'
import { useToast } from '@totalsoft/rocket-ui'
import { Info, LocationOn, Face, PersonAdd } from '@mui/icons-material'

const CONFERENCE_QUERY = gql`
  query Conference($id: Int!) {
    conference(id: $id) {
      id
      name
      startDate
      endDate
      organizerEmail
      conferenceType { id name }
      category { id name }
      location {
        id
        name
        address
        city { id name }
        county { id name }
        country { id name }
        latitude
        longitude
      }
      speakers { id name nationality rating }
    }
  }
`

const SAVE_CONFERENCE_MUTATION = gql`
  mutation SaveConference($conference: ConferenceInput!) {
    saveConference(conference: $conference) {
      id
      name
    }
  }
`

const COUNTRY_LIST_QUERY = gql`
  query CountryList { countryList { id name code } }
`
const COUNTY_LIST_QUERY = gql`
  query CountyList { countyList { id name code } }
`
const CITY_LIST_QUERY = gql`
  query CityList { cityList { id name code } }
`

const CONFERENCE_TYPE_LIST_QUERY = gql`
  query ConferenceTypeList { conferenceTypeList { id name code } }
`
const CATEGORY_LIST_QUERY = gql`
  query CategoryList { categoryList { id name code } }
`

const steps = ['ConferenceInfo', 'Location', 'Speakers']

const validateConferenceInfo = conf => !!(conf.name && conf.startDate && conf.endDate && conf.type && conf.category)
const validateLocation = loc => !!(loc.name && loc.address && loc.country && loc.county && loc.city)
const validateSpeakers = speakers => Array.isArray(speakers) && speakers.length > 0 && speakers.every(s => s.name)

const ConferenceContainer = () => {
  const { t } = useTranslation()
  const [, setHeader] = useHeader()
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const [conference, dispatch] = useReducer(reducer, initialConference)
  const showToast = useToast()
  const [step, setStep] = useState(0)

  // Tüm useQuery hook'ları en başta, koşulsuz
  const { data, loading, error } = useQuery(CONFERENCE_QUERY, {
    variables: { id: isNew ? 0 : Number(id) },
    skip: isNew
  })
  const { data: countryData } = useQuery(COUNTRY_LIST_QUERY)
  const { data: countyData } = useQuery(COUNTY_LIST_QUERY)
  const { data: cityData } = useQuery(CITY_LIST_QUERY)
  const { data: conferenceTypeData } = useQuery(CONFERENCE_TYPE_LIST_QUERY)
  const { data: categoryListData } = useQuery(CATEGORY_LIST_QUERY)

  const [saveConference] = useMutation(SAVE_CONFERENCE_MUTATION)

  useEffect(() => {
    if (!isNew && data?.conference) {
      dispatch({ type: 'resetData', payload: data.conference })
    }
  }, [isNew, data])

  useEffect(() => {
    if (error) {
      showToast('Konferans detayları yüklenirken bir hata oluştu!', 'error')
    }
  }, [error, showToast])

  useEffect(() => {
    setHeader(null) // Header'ı gizle
    return () => setHeader(null)
  }, [setHeader])

  if (loading) {
    return <FakeText lines={10} />
  }

  // Dictionary verileri ileride API'den alınmalı
  const dictData = {
    typeList: conferenceTypeData?.conferenceTypeList || [],
    categoryList: categoryListData?.categoryList || [],
    countryList: countryData?.countryList || [],
    countyList: countyData?.countyList || [],
    cityList: cityData?.cityList || []
  }

  // Stepper UI
  return (
    <div>
      {step === 0 && (
        <Card icon={Info} title={t('Conference.Info')}>
          <ConferenceInfo
            types={dictData.typeList}
            categories={dictData.categoryList}
            conference={conference}
            dispatch={dispatch}
            onNext={() => setStep(1)}
          />
        </Card>
      )}
      {step === 1 && (
        <Card icon={LocationOn} title={t('Conference.Location')}>
          <ConferenceLocation
            countries={dictData.countryList}
            counties={dictData.countyList}
            cities={dictData.cityList}
            location={conference.location}
            dispatch={dispatch}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        </Card>
      )}
      {step === 2 && (
        <Card 
          icon={Face} 
          title={t('Conference.Speakers')}
          actions={[
            <IconButton
              type="add"
              key="addButton"
              title="Konuşmacı Ekle"
              onClick={() => dispatch({ type: 'addSpeaker' })}
            />
          ]}
        >
          <ConferenceSpeakers
            speakers={conference.speakers}
            dispatch={dispatch}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <Button
              color='secondary'
              variant='outlined'
              onClick={() => setStep(1)}
            >
              Geri
            </Button>
            <Button
              color='success'
              onClick={async () => {
                try {
                  const input = {
                    id: conference.id,
                    name: conference.name,
                    startDate: conference.startDate,
                    endDate: conference.endDate,
                    conferenceTypeId: conference.type?.id,
                    type: conference.type && !conference.type.id ? { name: conference.type.name, code: conference.type.code } : undefined,
                    categoryId: conference.category?.id,
                    category: conference.category && !conference.category.id ? { name: conference.category.name, code: conference.category.code } : undefined,
                    organizerEmail: conference.organizerEmail,
                    location: {
                      id: conference.location?.id,
                      name: conference.location?.name,
                      address: conference.location?.address,
                      cityId: conference.location?.city?.id,
                      city: conference.location?.city && !conference.location.city.id ? { name: conference.location.city.name, code: conference.location.city.code } : undefined,
                      countyId: conference.location?.county?.id,
                      county: conference.location?.county && !conference.location.county.id ? { name: conference.location.county.name, code: conference.location.county.code } : undefined,
                      countryId: conference.location?.country?.id,
                      country: conference.location?.country && !conference.location.country.id ? { name: conference.location.country.name, code: conference.location.country.code } : undefined,
                      latitude: conference.location?.latitude ? parseFloat(conference.location.latitude) : undefined,
                      longitude: conference.location?.longitude ? parseFloat(conference.location.longitude) : undefined
                    },
                    speakers: (conference.speakers || []).map(s => ({
                      id: s.id,
                      name: s.name,
                      nationality: s.nationality,
                      rating: s.rating,
                      isMainSpeaker: s.isMainSpeaker
                    }))
                  }
                  await saveConference({ variables: { conference: input } })
                  showToast('Konferans başarıyla eklendi/düzenlendi!', 'success')
                  navigate('/conferences')
                } catch (e) {
                  showToast('Konferans kaydedilirken bir hata oluştu!', 'error')
                }
              }}
              disabled={!validateSpeakers(conference.speakers)}
            >
              Kaydı Tamamla
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default ConferenceContainer
