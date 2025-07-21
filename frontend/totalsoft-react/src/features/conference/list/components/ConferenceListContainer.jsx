import React, { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FakeText, IconButton } from '@totalsoft/rocket-ui'
import ConferenceFilters from './ConferenceFilters'
import ConferenceList from './ConferenceList'
import { generateDefaultFilters } from 'utils/functions'
import { useHeader } from 'providers/AreasProvider'
import ConferenceHeader from './ConferenceHeader'
import { useNavigate } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { useEmail } from 'hooks/useEmail'
import { useToast } from '@totalsoft/rocket-ui'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'

const CONFERENCE_LIST_QUERY = gql`
  query ConferenceList($filters: ConferenceFilterInput, $userEmail: String!) {
    conferenceList(filters: $filters, userEmail: $userEmail) {
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
      speakers {
        id
        name
        nationality
        rating
        isMainSpeaker
      }
    }
  }
`

const ConferenceListContainer = () => {
  const [filters, setFilters] = useState({})
  const { t } = useTranslation()
  const [, setHeader] = useHeader()
  const navigate = useNavigate()
  const [email] = useEmail()
  const showToast = useToast()

  const { data, loading, error, refetch } = useQuery(CONFERENCE_LIST_QUERY, {
    variables: { filters, userEmail: email || '' }
  })

  useEffect(() => {
    if (data?.conferenceList) {
      showToast('Konferanslar başarıyla listelendi!', 'success')
    }
  }, [data, showToast])

  useEffect(() => {
    if (error) {
      showToast('Konferanslar yüklenirken bir hata oluştu!', 'error')
    }
  }, [error, showToast])

  const handleApplyFilters = useCallback(filters => setFilters(filters), [])

  const handleAddClick = useCallback(() => {
    navigate('/conferences/new')
  }, [navigate])

  useEffect(() => {
    setHeader(
      <ConferenceHeader
        title={t('NavBar.Conferences')}
        actions={
          <>
            <IconButton
              key="refreshButton"
              title={t('General.Buttons.Refresh') || 'Yenile'}
              onClick={() => refetch()}
            >
              <RefreshIcon />
            </IconButton>
            <IconButton
              key="addButton"
              title={t('General.Buttons.AddConference')}
              onClick={handleAddClick}
            >
              <AddIcon />
            </IconButton>
          </>
        }
      />
    )
    return () => setHeader(null)
  }, [setHeader, t, handleAddClick, refetch])

  if (loading) {
    return <FakeText lines={10} />
  }

  return (
    <>
      <ConferenceFilters filters={filters} onApplyFilters={handleApplyFilters} />
      <ConferenceList conferences={data?.conferenceList || []} />
    </>
  )
}

export default ConferenceListContainer
