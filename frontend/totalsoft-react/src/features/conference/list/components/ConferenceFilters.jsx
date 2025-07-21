import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Button, Card, DateTime } from '@totalsoft/rocket-ui'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useCallback } from 'react'
import { generateDefaultFilters } from 'utils/functions'
const ConferenceFilters = _props => {
  const { filters, onApplyFilters } = _props
  const [name, setName] = useState(filters.name || '')
  const [startDate, setStartDate] = useState(filters.startDate)
  const [endDate, setEndDate] = useState(filters.endDate)
  const handleApplyClick = useCallback(() => onApplyFilters({ name, startDate, endDate }), [onApplyFilters, name, endDate, startDate])
    const handleKeyPressed = useCallback(({ keyCode }) => (keyCode === 13 && handleApplyClick()), [handleApplyClick])
    const handleResetClick = useCallback(() => {
    setName('')
    setStartDate(undefined)
    setEndDate(undefined)
    onApplyFilters({ name: '', startDate: undefined, endDate: undefined })
}, [onApplyFilters])
  const { t } = useTranslation()

  return (
    <>
      <Card icon={SearchIcon} iconColor='secondary'>
        <Grid container spacing={2} onKeyDown={handleKeyPressed}>
          <Grid item xs={12} lg={3}>
            <DateTime label={t('Conference.Filters.StartDate')} isClearable value={startDate}
    onChange={setStartDate} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <DateTime label={t('Conference.Filters.EndDate')} isClearable value={endDate}
    onChange={setEndDate} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <input
              type="text"
              placeholder={t('Conference.Filters.Name') || 'Conference Name'}
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', height: 40, borderRadius: 4, border: '1px solid #ccc', padding: '0 12px' }}
            />
          </Grid>
        </Grid>
      </Card>
      <Button size={'small'} color={'primary'} right={true} onClick={handleResetClick}>
        {t('General.Buttons.ResetFilters')}
      </Button>
      <Button size={'small'} color={'primary'} right={true} onClick={handleApplyClick}>
        {t('General.Buttons.ApplyFilters')}
      </Button>
    </>
  )
}
ConferenceFilters.propTypes = {
    filters: PropTypes.object,
    onApplyFilters: PropTypes.func
}
export default ConferenceFilters
