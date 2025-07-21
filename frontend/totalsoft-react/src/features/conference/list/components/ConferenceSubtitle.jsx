import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import RoomIcon from '@mui/icons-material/Room'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import { Grid } from '@mui/material'
import { Typography } from '@totalsoft/rocket-ui'

const ConferenceSubtitle = props => {
  const { speaker, location } = props
  const { t } = useTranslation()

  return (
    <Grid container item lg={12}>
      <Grid item lg={1}>
        <PermIdentityIcon />
      </Grid>
      <Grid item lg={11}>
        <Typography>{t('Conference.Speaker')}</Typography>
        <Typography>{speaker?.name || 'speaker'}</Typography>
      </Grid>
      <Grid item lg={1}>
        <RoomIcon />
      </Grid>
      <Grid item lg={11}>
        <Typography>
          {location ?
            [
              location?.city?.name || 'city',
              location?.county?.name || 'county',
              location?.country?.name || 'country'
            ]
              .filter(Boolean)
              .join(', ')
              .replace(/^(city, county, country)$/,'Konum bilgisi yok') // Eğer hepsi eksikse
            : 'Konum bilgisi yok'
          }
        </Typography>
      </Grid>
    </Grid>
  )
}

ConferenceSubtitle.propTypes = {
  speaker: PropTypes.object,
  location: PropTypes.object.isRequired
}

export default ConferenceSubtitle