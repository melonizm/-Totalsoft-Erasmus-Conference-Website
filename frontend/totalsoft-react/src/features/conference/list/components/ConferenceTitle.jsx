import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@mui/material'
import { IconButton, Typography } from '@totalsoft/rocket-ui'
import { emptyString } from 'utils/constants'
import { useTranslation } from 'react-i18next'

const ConferenceTitle = props => {
  const { t } = useTranslation()
  const { title, onEdit, onDelete } = props

  return (
    <Grid container justifyContent='flex-start' alignItems='center'>
      <Grid item xs={9} sm={9} lg={9} container justifyContent='flex-start'>
        <Typography variant='subtitle1'>{title || emptyString}</Typography>
      </Grid>
      <Grid item xs={3} sm={3} lg={3} container justifyContent='flex-end' spacing={1}>
        <Grid item>
          <IconButton type='edit' onClick={onEdit} title={t('Conference.Edit')} size='tiny' />
        </Grid>
        <Grid item>
          <IconButton type='delete' onClick={onDelete} title={t('Conference.Delete')} size='tiny' />
        </Grid>
      </Grid>
    </Grid>
  )
}

ConferenceTitle.propTypes = {
  title: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
}

export default ConferenceTitle