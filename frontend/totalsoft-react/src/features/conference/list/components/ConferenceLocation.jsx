import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@mui/material'
import { Autocomplete, TextField, Button } from '@totalsoft/rocket-ui'
import { useTranslation } from 'react-i18next'
import { useQuery, gql, useMutation } from '@apollo/client'
import { Box, Fade, Paper } from '@mui/material'
import { useToast } from '@totalsoft/rocket-ui'

const IS_COUNTRY_EXISTS = gql`
  query IsCountryExists($name: String!) {
    isCountryExists(name: $name)
  }
`
const IS_COUNTY_EXISTS = gql`
  query IsCountyExists($name: String!) {
    isCountyExists(name: $name)
  }
`
const IS_CITY_EXISTS = gql`
  query IsCityExists($name: String!) {
    isCityExists(name: $name)
  }
`
const ADD_COUNTRY = gql`
  mutation AddCountry($name: String!, $code: String) {
    addCountry(name: $name, code: $code)
  }
`
const ADD_COUNTY = gql`
  mutation AddCounty($name: String!, $code: String) {
    addCounty(name: $name, code: $code)
  }
`
const ADD_CITY = gql`
  mutation AddCity($name: String!, $code: String) {
    addCity(name: $name, code: $code)
  }
`

const InfoBubble = ({ show, exists, label }) => (
  <Fade in={show} timeout={200}>
    <Box sx={{ position: 'absolute', top: -48, left: 0, width: '100%', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <Paper elevation={3} sx={{ px: 2, py: 1, borderRadius: 2, minWidth: 120, textAlign: 'center', background: exists ? '#e8f5e9' : '#ffebee', color: exists ? '#388e3c' : '#d32f2f', fontWeight: 500, fontSize: 15, boxShadow: 3, position: 'relative' }}>
        {exists ? `${label} veritabanında mevcut` : `${label} veritabanında mevcut değil`}
        <Box sx={{ position: 'absolute', left: '50%', bottom: -12, transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: exists ? '12px solid #e8f5e9' : '12px solid #ffebee' }} />
      </Paper>
    </Box>
  </Fade>
)

const ConferenceLocation = props => {
  const {
    countries,
    counties,
    cities,
    location,
    dispatch
  } = props

  const { name, address, country, county, city, latitude, longitude } = location
  const { t } = useTranslation()
  const showToast = useToast()
  const [addCountry] = useMutation(ADD_COUNTRY, { refetchQueries: ['CountryList'] })
  const [addCounty] = useMutation(ADD_COUNTY, { refetchQueries: ['CountyList'] })
  const [addCity] = useMutation(ADD_CITY, { refetchQueries: ['CityList'] })

  const handleDispatch = actionType => value =>
    dispatch({ type: actionType, payload: value })

  // Helper: Autocomplete onChange
  const handleAutocomplete = (actionType) => value => {
    if (typeof value === 'string') {
      dispatch({ type: actionType, payload: { id: undefined, name: value } })
    } else {
      dispatch({ type: actionType, payload: value })
    }
  }

  // State for input focus
  const [countryInput, setCountryInput] = React.useState('')
  const [countyInput, setCountyInput] = React.useState('')
  const [cityInput, setCityInput] = React.useState('')
  const [countryFocus, setCountryFocus] = React.useState(false)
  const [countyFocus, setCountyFocus] = React.useState(false)
  const [cityFocus, setCityFocus] = React.useState(false)

  // Apollo queries
  const { data: countryExistsData } = useQuery(IS_COUNTRY_EXISTS, {
    variables: { name: countryInput },
    skip: !countryInput,
    fetchPolicy: 'network-only'
  })
  const { data: countyExistsData } = useQuery(IS_COUNTY_EXISTS, {
    variables: { name: countyInput },
    skip: !countyInput,
    fetchPolicy: 'network-only'
  })
  const { data: cityExistsData } = useQuery(IS_CITY_EXISTS, {
    variables: { name: cityInput },
    skip: !cityInput,
    fetchPolicy: 'network-only'
  })

  const handleAddMissing = async () => {
    let added = false
    if (countryInput && !countryExistsData?.isCountryExists) {
      const res = await addCountry({ variables: { name: countryInput } })
      added = res.data?.addCountry
    }
    if (countyInput && !countyExistsData?.isCountyExists) {
      const res = await addCounty({ variables: { name: countyInput } })
      added = added || res.data?.addCounty
    }
    if (cityInput && !cityExistsData?.isCityExists) {
      const res = await addCity({ variables: { name: cityInput } })
      added = added || res.data?.addCity
    }
    if (added) {
      showToast('Veritabanında bulunmayan veriler başarıyla kaydedildi', 'success')
    }
  }

  const hasMissing = (countryInput && !countryExistsData?.isCountryExists) || (countyInput && !countyExistsData?.isCountyExists) || (cityInput && !cityExistsData?.isCityExists)

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label={t('Conference.Name')}
          fullWidth
          value={name}
          onChange={handleDispatch('locationName')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label={t('Conference.Address')}
          fullWidth
          value={address}
          onChange={handleDispatch('address')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} sx={{ position: 'relative' }}>
        <InfoBubble
          show={countryFocus && !!countryInput}
          exists={countryExistsData?.isCountryExists}
          label={t('Conference.Country')}
        />
        <Autocomplete
          label={t('Conference.Country')}
          options={countries}
          value={country}
          onChange={handleAutocomplete('country')}
          getOptionLabel={option => option?.name || ''}
          getOptionValue={option => option?.id}
          isClearable
          isSearchable
          creatable
          fullWidth
          inputValue={countryInput}
          onInputChange={(_, v) => setCountryInput(v)}
          onFocus={() => setCountryFocus(true)}
          onBlur={() => setCountryFocus(false)}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} sx={{ position: 'relative' }}>
        <InfoBubble
          show={countyFocus && !!countyInput}
          exists={countyExistsData?.isCountyExists}
          label={t('Conference.County')}
        />
        <Autocomplete
          label={t('Conference.County')}
          options={counties}
          value={county}
          onChange={handleAutocomplete('county')}
          getOptionLabel={option => option?.name || ''}
          getOptionValue={option => option?.id}
          isClearable
          isSearchable
          creatable
          fullWidth
          inputValue={countyInput}
          onInputChange={(_, v) => setCountyInput(v)}
          onFocus={() => setCountyFocus(true)}
          onBlur={() => setCountyFocus(false)}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} sx={{ position: 'relative' }}>
        <InfoBubble
          show={cityFocus && !!cityInput}
          exists={cityExistsData?.isCityExists}
          label={t('Conference.City')}
        />
        <Autocomplete
          label={t('Conference.City')}
          options={cities}
          value={city}
          onChange={handleAutocomplete('city')}
          getOptionLabel={option => option?.name || ''}
          getOptionValue={option => option?.id}
          isClearable
          isSearchable
          creatable
          fullWidth
          inputValue={cityInput}
          onInputChange={(_, v) => setCityInput(v)}
          onFocus={() => setCityFocus(true)}
          onBlur={() => setCityFocus(false)}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label={t('Conference.Latitude')}
          fullWidth
          value={latitude}
          onChange={handleDispatch('latitude')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label={t('Conference.Longitude')}
          fullWidth
          value={longitude}
          onChange={handleDispatch('longitude')}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mt: 2 }}>
        <Button
          color='secondary'
          variant='outlined'
          onClick={props.onBack}
        >
          Geri
        </Button>
        {hasMissing && (
          <Button
            color='success'
            variant='outlined'
            onClick={handleAddMissing}
          >
            Veritabanında Bulunmayan Verileri Kaydet
          </Button>
        )}
        <Button
          color='primary'
          onClick={props.onNext}
          disabled={hasMissing || !(name && address && country && county && city)}
        >
          Devam Et
        </Button>
      </Grid>
    </Grid>
  )
}

ConferenceLocation.propTypes = {
  countries: PropTypes.array.isRequired,
  counties: PropTypes.array.isRequired,
  cities: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
}

export default ConferenceLocation
