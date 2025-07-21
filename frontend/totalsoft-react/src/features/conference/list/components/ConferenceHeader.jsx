// src\features\conference\ConferenceHeader.js
import React from 'react'
import PropTypes from 'prop-types'
import { emptyString } from 'utils/constants'
import { Grid } from '@mui/material'
import { Typography } from '@totalsoft/rocket-ui'

const ConferenceHeader = props => {
  const { title, actions } = props

  return (
    <Grid container justifyContent='flex-start' alignItems='center'>
      <Grid item xs={9} sm={9} lg={9} container justifyContent='flex-start'>
        <Typography variant='subtitle1'>{title || emptyString}</Typography>
      </Grid>
      <Grid item xs={3} sm={3} lg={3} container justifyContent='flex-end' spacing={1}>
        {actions}
      </Grid>
    </Grid>
  )
}

ConferenceHeader.propTypes = {
  title: PropTypes.string,
  actions: PropTypes.node
}

export default ConferenceHeader