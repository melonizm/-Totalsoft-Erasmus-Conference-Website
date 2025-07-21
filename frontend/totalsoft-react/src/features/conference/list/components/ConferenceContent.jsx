import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import attendeeStatus from 'constants/attendeeStatus'
import { Grid } from '@mui/material'
import { Button, Typography } from '@totalsoft/rocket-ui'
const ConferenceContent = props => {
  const { conference } = props
  const { status, startDate, endDate, conferenceType, category } = conference

  const { t } = useTranslation()
  const noStatusSet = t('Conference.StatusNotSet')
  const showJoin = status?.id === attendeeStatus.Attended
  const showWithdraw = status?.id === attendeeStatus.Attended || status?.id === attendeeStatus.Joined
  const showAttend = status?.id === attendeeStatus.Withdrawn || !status?.id

  const startDateFormatted = t('DATE_FORMAT', { date: { value: startDate, format: 'DD-MM-YYYY HH:mm' } })
  const endDateFormatted = t('DATE_FORMAT', { date: { value: endDate, format: 'DD-MM-YYYY HH:mm' } })

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant='subtitle1' color='error'>
          {status?.name || noStatusSet}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>{`${startDateFormatted} - ${endDateFormatted}`}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>{`${conferenceType?.name || 'type'}, ${category?.name || 'category'}`}</Typography>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {showJoin && (
            <Button right color='success' size={'small'}>
              {t('Conference.Filters.Join')}
            </Button>
          )}
          {showWithdraw && (
            <Button right color='error' size={'small'}>
              {t('Conference.Filters.Withdraw')}
            </Button>
          )}
          {showAttend && (
            <Button right color='info' size={'small'}>
              {t('Conference.Filters.Attend')}
            </Button>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

ConferenceContent.propTypes = {
  conference: PropTypes.object.isRequired
}

export default ConferenceContent