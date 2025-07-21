import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Info, LocationOn, Face } from '@mui/icons-material'
import ConferenceInfo from './ConferenceInfo'
import ConferenceLocation from './ConferenceLocation'
import ConferenceSpeakers from './ConferenceSpeakers'
import { Card, IconButton } from '@totalsoft/rocket-ui'

const Conference = props => {
  const {
    types,
    categories,
    countries,
    counties,
    cities,
    conference,
    dispatch
  } = props

  const { t } = useTranslation()

  // ✅ Konferanstan location ve speakers'ı ayıkla
  const { location, speakers } = conference

  const handleAddButton = useCallback(() => dispatch({ type: 'addSpeaker' }), [dispatch])

  return (
    <>
      <Card icon={Info} title={t('Conference.Info')}>
        <ConferenceInfo
          types={types}
          categories={categories}
          conference={conference}
          dispatch={dispatch}
        />
      </Card>

      <Card icon={LocationOn} title={t('Conference.Location')}>
        <ConferenceLocation
          countries={countries}
          counties={counties}
          cities={cities}
          location={location}
          dispatch={dispatch}
        />
      </Card>

      <Card
        icon={Face}
        title={t('Conference.Speakers')}
        actions={[
          <IconButton
            type="add"
            key="addButton"
            title={t('General.Buttons.AddSpeaker')}
            onClick={handleAddButton}
          />
        ]}
      >
        <ConferenceSpeakers
          speakers={speakers}
          dispatch={dispatch}
        />
      </Card>
    </>
  )
}

Conference.propTypes = {
  types: PropTypes.array,
  categories: PropTypes.array,
  countries: PropTypes.array,
  counties: PropTypes.array,
  cities: PropTypes.array,
  conference: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default Conference
