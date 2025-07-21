import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Card, FakeText, Button, TextField, Autocomplete } from '@totalsoft/rocket-ui'
import { Typography, Grid, Chip, Box, Divider } from '@mui/material'
import { useToast } from '@totalsoft/rocket-ui'

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
      speakers { id name nationality rating isMainSpeaker }
    }
  }
`

const UPDATE_CONFERENCE = gql`
  mutation UpdateConference($conference: ConferenceInput!) {
    saveConference(conference: $conference) {
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
      speakers { id name nationality rating isMainSpeaker }
    }
  }
`

// Dictionary existence queries and add mutations
const IS_CONFERENCE_TYPE_EXISTS = gql`
  query IsConferenceTypeExists($name: String!) { isConferenceTypeExists(name: $name) }
`
const IS_CATEGORY_EXISTS = gql`
  query IsCategoryExists($name: String!) { isCategoryExists(name: $name) }
`
const IS_COUNTRY_EXISTS = gql`
  query IsCountryExists($name: String!) { isCountryExists(name: $name) }
`
const IS_COUNTY_EXISTS = gql`
  query IsCountyExists($name: String!) { isCountyExists(name: $name) }
`
const IS_CITY_EXISTS = gql`
  query IsCityExists($name: String!) { isCityExists(name: $name) }
`
const ADD_CONFERENCE_TYPE = gql`
  mutation AddConferenceType($name: String!, $code: String) { addConferenceType(name: $name, code: $code) }
`
const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!, $code: String) { addCategory(name: $name, code: $code) }
`
const ADD_COUNTRY = gql`
  mutation AddCountry($name: String!, $code: String) { addCountry(name: $name, code: $code) }
`
const ADD_COUNTY = gql`
  mutation AddCounty($name: String!, $code: String) { addCounty(name: $name, code: $code) }
`
const ADD_CITY = gql`
  mutation AddCity($name: String!, $code: String) { addCity(name: $name, code: $code) }
`

// Dictionary list queries
const CONFERENCE_TYPE_LIST_QUERY = gql`
  query ConferenceTypeList { conferenceTypeList { id name code } }
`
const CATEGORY_LIST_QUERY = gql`
  query CategoryList { categoryList { id name code } }
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

const InfoRow = ({ label, value, isEditing, onChange }) => (
  <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
    <Grid item xs={4} md={3}>
      <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
    </Grid>
    <Grid item xs={8} md={9}>
      {isEditing ? (
        <TextField
          fullWidth
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          size="small"
        />
      ) : (
        <Typography variant="body1">{value}</Typography>
      )}
    </Grid>
  </Grid>
)

const ConferenceView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const showToast = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(null)
  
  // Dictionary input states
  const [typeInput, setTypeInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [countryInput, setCountryInput] = useState('')
  const [countyInput, setCountyInput] = useState('')
  const [cityInput, setCityInput] = useState('')

  const { data, loading, error } = useQuery(CONFERENCE_QUERY, { 
    variables: { id: Number(id) },
    onCompleted: (data) => {
      setEditedData(data.conference)
    }
  })

  const [updateConference] = useMutation(UPDATE_CONFERENCE)
  // Existence queries
  const { data: typeExistsData } = useQuery(IS_CONFERENCE_TYPE_EXISTS, { variables: { name: typeInput }, skip: !typeInput, fetchPolicy: 'network-only' })
  const { data: categoryExistsData } = useQuery(IS_CATEGORY_EXISTS, { variables: { name: categoryInput }, skip: !categoryInput, fetchPolicy: 'network-only' })
  const { data: countryExistsData } = useQuery(IS_COUNTRY_EXISTS, { variables: { name: countryInput }, skip: !countryInput, fetchPolicy: 'network-only' })
  const { data: countyExistsData } = useQuery(IS_COUNTY_EXISTS, { variables: { name: countyInput }, skip: !countyInput, fetchPolicy: 'network-only' })
  const { data: cityExistsData } = useQuery(IS_CITY_EXISTS, { variables: { name: cityInput }, skip: !cityInput, fetchPolicy: 'network-only' })
  // Add mutations
  const [addConferenceType] = useMutation(ADD_CONFERENCE_TYPE)
  const [addCategory] = useMutation(ADD_CATEGORY)
  const [addCountry] = useMutation(ADD_COUNTRY)
  const [addCounty] = useMutation(ADD_COUNTY)
  const [addCity] = useMutation(ADD_CITY)

  // Dictionary listeleri
  const { data: typeListData, refetch: refetchTypeList } = useQuery(CONFERENCE_TYPE_LIST_QUERY)
  const { data: categoryListData, refetch: refetchCategoryList } = useQuery(CATEGORY_LIST_QUERY)
  const { data: countryListData, refetch: refetchCountryList } = useQuery(COUNTRY_LIST_QUERY)
  const { data: countyListData, refetch: refetchCountyList } = useQuery(COUNTY_LIST_QUERY)
  const { data: cityListData, refetch: refetchCityList } = useQuery(CITY_LIST_QUERY)
  const typeList = typeListData?.conferenceTypeList || []
  const categoryList = categoryListData?.categoryList || []
  const countryList = countryListData?.countryList || []
  const countyList = countyListData?.countyList || []
  const cityList = cityListData?.cityList || []

  if (loading) return <FakeText lines={10} />
  if (error) return <div>Hata: {error.message}</div>
  
  const conf = isEditing ? editedData : data?.conference
  if (!conf) return <div>Konferans bulunamadı.</div>

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      await updateConference({
        variables: {
          conference: {
            id: Number(id),
            name: editedData.name,
            startDate: editedData.startDate,
            endDate: editedData.endDate,
            organizerEmail: editedData.organizerEmail,
            conferenceTypeId: editedData.conferenceType?.id,
            categoryId: editedData.category?.id,
            location: {
              id: editedData.location?.id,
              name: editedData.location?.name,
              address: editedData.location?.address,
              cityId: editedData.location?.city?.id,
              countyId: editedData.location?.county?.id,
              countryId: editedData.location?.country?.id,
              latitude: editedData.location?.latitude,
              longitude: editedData.location?.longitude
            },
            speakers: editedData.speakers.map(s => ({
              id: s.id,
              name: s.name,
              nationality: s.nationality,
              rating: s.rating,
              isMainSpeaker: s.isMainSpeaker
            }))
          }
        }
      })
      showToast('Konferans başarıyla güncellendi!', 'success')
      setIsEditing(false)
    } catch (error) {
      showToast('Güncelleme sırasında bir hata oluştu!', 'error')
    }
  }

  const handleChange = (field) => (value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLocationChange = (field) => (value) => {
    setEditedData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }))
  }

  // Check for missing dictionary data
  const hasMissing = (
    (typeInput && !typeExistsData?.isConferenceTypeExists) ||
    (categoryInput && !categoryExistsData?.isCategoryExists) ||
    (countryInput && !countryExistsData?.isCountryExists) ||
    (countyInput && !countyExistsData?.isCountyExists) ||
    (cityInput && !cityExistsData?.isCityExists)
  )
  // Add missing dictionary data
  const handleAddMissing = async () => {
    let added = false
    let newType, newCategory, newCountry, newCounty, newCity
    if (typeInput && !typeExistsData?.isConferenceTypeExists) {
      await addConferenceType({ variables: { name: typeInput }, refetchQueries: ['ConferenceTypeList'] })
      await refetchTypeList()
      newType = (typeListData?.conferenceTypeList || []).find(t => t.name === typeInput)
      if (newType) setEditedData(prev => ({ ...prev, conferenceType: newType }))
      added = true
    }
    if (categoryInput && !categoryExistsData?.isCategoryExists) {
      await addCategory({ variables: { name: categoryInput }, refetchQueries: ['CategoryList'] })
      await refetchCategoryList()
      newCategory = (categoryListData?.categoryList || []).find(c => c.name === categoryInput)
      if (newCategory) setEditedData(prev => ({ ...prev, category: newCategory }))
      added = true
    }
    if (countryInput && !countryExistsData?.isCountryExists) {
      await addCountry({ variables: { name: countryInput }, refetchQueries: ['CountryList'] })
      await refetchCountryList()
      newCountry = (countryListData?.countryList || []).find(c => c.name === countryInput)
      if (newCountry) setEditedData(prev => ({ ...prev, location: { ...prev.location, country: newCountry } }))
      added = true
    }
    if (countyInput && !countyExistsData?.isCountyExists) {
      await addCounty({ variables: { name: countyInput }, refetchQueries: ['CountyList'] })
      await refetchCountyList()
      newCounty = (countyListData?.countyList || []).find(c => c.name === countyInput)
      if (newCounty) setEditedData(prev => ({ ...prev, location: { ...prev.location, county: newCounty } }))
      added = true
    }
    if (cityInput && !cityExistsData?.isCityExists) {
      await addCity({ variables: { name: cityInput }, refetchQueries: ['CityList'] })
      await refetchCityList()
      newCity = (cityListData?.cityList || []).find(c => c.name === cityInput)
      if (newCity) setEditedData(prev => ({ ...prev, location: { ...prev.location, city: newCity } }))
      added = true
    }
    if (added) {
      showToast('Veritabanında bulunmayan veriler başarıyla kaydedildi', 'success')
    }
  }

  return (
    <Box sx={{ maxWidth: 700, margin: '40px auto', p: 2 }}>
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: 3, background: '#f9f9fb' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight={700}>{conf.name}</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isEditing && hasMissing ? (
              <Button color='success' variant='contained' onClick={handleAddMissing}>
                Veritabanında Bulunmayan Verileri Ekle
              </Button>
            ) : (
              <Button 
                color={isEditing ? 'success' : 'info'} 
                variant='contained' 
                onClick={isEditing ? handleSave : handleEdit}
                disabled={isEditing && hasMissing}
              >
                {isEditing ? 'Kaydet' : 'Düzenle'}
              </Button>
            )}
            <Button color='secondary' variant='outlined' onClick={() => navigate('/conferences')}>
              Geri Dön
            </Button>
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {/* ConferenceType Autocomplete */}
        <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Grid item xs={4} md={3}>
            <Typography variant="subtitle2" color="text.secondary">Konferans Türü</Typography>
          </Grid>
          <Grid item xs={8} md={9}>
            {isEditing ? (
              <Autocomplete
                label="Konferans Türü"
                value={editedData.conferenceType}
                onChange={v => setEditedData(prev => ({ ...prev, conferenceType: v }))}
                inputValue={typeInput}
                onInputChange={(_, v) => setTypeInput(v)}
                options={typeList}
                getOptionLabel={option => option?.name || ''}
                getOptionValue={option => option?.id}
                isClearable
                isSearchable
                creatable
                fullWidth
              />
            ) : (
              <Typography variant="body1">{conf.conferenceType?.name || '-'}</Typography>
            )}
          </Grid>
        </Grid>
        {/* Category Autocomplete */}
        <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Grid item xs={4} md={3}>
            <Typography variant="subtitle2" color="text.secondary">Kategori</Typography>
          </Grid>
          <Grid item xs={8} md={9}>
            {isEditing ? (
              <Autocomplete
                label="Kategori"
                value={editedData.category}
                onChange={v => setEditedData(prev => ({ ...prev, category: v }))}
                inputValue={categoryInput}
                onInputChange={(_, v) => setCategoryInput(v)}
                options={categoryList}
                getOptionLabel={option => option?.name || ''}
                getOptionValue={option => option?.id}
                isClearable
                isSearchable
                creatable
                fullWidth
              />
            ) : (
              <Typography variant="body1">{conf.category?.name || '-'}</Typography>
            )}
          </Grid>
        </Grid>
        {/* Country Autocomplete */}
        <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Grid item xs={4} md={3}>
            <Typography variant="subtitle2" color="text.secondary">Ülke</Typography>
          </Grid>
          <Grid item xs={8} md={9}>
            {isEditing ? (
              <Autocomplete
                label="Ülke"
                value={editedData.location?.country}
                onChange={v => setEditedData(prev => ({ ...prev, location: { ...prev.location, country: v } }))}
                inputValue={countryInput}
                onInputChange={(_, v) => setCountryInput(v)}
                options={countryList}
                getOptionLabel={option => option?.name || ''}
                getOptionValue={option => option?.id}
                isClearable
                isSearchable
                creatable
                fullWidth
              />
            ) : (
              <Typography variant="body1">{conf.location?.country?.name || '-'}</Typography>
            )}
          </Grid>
        </Grid>
        {/* County Autocomplete */}
        <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Grid item xs={4} md={3}>
            <Typography variant="subtitle2" color="text.secondary">İlçe</Typography>
          </Grid>
          <Grid item xs={8} md={9}>
            {isEditing ? (
              <Autocomplete
                label="İlçe"
                value={editedData.location?.county}
                onChange={v => setEditedData(prev => ({ ...prev, location: { ...prev.location, county: v } }))}
                inputValue={countyInput}
                onInputChange={(_, v) => setCountyInput(v)}
                options={countyList}
                getOptionLabel={option => option?.name || ''}
                getOptionValue={option => option?.id}
                isClearable
                isSearchable
                creatable
                fullWidth
              />
            ) : (
              <Typography variant="body1">{conf.location?.county?.name || '-'}</Typography>
            )}
          </Grid>
        </Grid>
        {/* City Autocomplete */}
        <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Grid item xs={4} md={3}>
            <Typography variant="subtitle2" color="text.secondary">Şehir</Typography>
          </Grid>
          <Grid item xs={8} md={9}>
            {isEditing ? (
              <Autocomplete
                label="Şehir"
                value={editedData.location?.city}
                onChange={v => setEditedData(prev => ({ ...prev, location: { ...prev.location, city: v } }))}
                inputValue={cityInput}
                onInputChange={(_, v) => setCityInput(v)}
                options={cityList}
                getOptionLabel={option => option?.name || ''}
                getOptionValue={option => option?.id}
                isClearable
                isSearchable
                creatable
                fullWidth
              />
            ) : (
              <Typography variant="body1">{conf.location?.city?.name || '-'}</Typography>
            )}
          </Grid>
        </Grid>
        <InfoRow 
          label="Başlangıç" 
          value={new Date(conf.startDate).toLocaleString()} 
          isEditing={isEditing}
          onChange={handleChange('startDate')}
        />
        <InfoRow 
          label="Bitiş" 
          value={new Date(conf.endDate).toLocaleString()} 
          isEditing={isEditing}
          onChange={handleChange('endDate')}
        />
        <InfoRow 
          label="Düzenleyen" 
          value={conf.organizerEmail || '-'} 
          isEditing={isEditing}
          onChange={handleChange('organizerEmail')}
        />
        <InfoRow 
          label="Adres" 
          value={conf.location?.address || '-'} 
          isEditing={isEditing}
          onChange={handleLocationChange('address')}
        />
        <InfoRow 
          label="Şehir" 
          value={conf.location?.city?.name || '-'} 
          isEditing={isEditing}
          onChange={handleLocationChange('city')}
        />
        <InfoRow 
          label="İlçe" 
          value={conf.location?.county?.name || '-'} 
          isEditing={isEditing}
          onChange={handleLocationChange('county')}
        />
        <InfoRow 
          label="Ülke" 
          value={conf.location?.country?.name || '-'} 
          isEditing={isEditing}
          onChange={handleLocationChange('country')}
        />
        <InfoRow 
          label="Latitude" 
          value={conf.location?.latitude || '-'} 
          isEditing={isEditing}
          onChange={handleLocationChange('latitude')}
        />
        <InfoRow 
          label="Longitude" 
          value={conf.location?.longitude || '-'} 
          isEditing={isEditing}
          onChange={handleLocationChange('longitude')}
        />
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" fontWeight={600} gutterBottom>Konuşmacılar</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {conf.speakers.length === 0 && <Typography color="text.secondary">Konuşmacı yok.</Typography>}
          {conf.speakers.map(s => (
            <Chip
              key={s.id}
              label={`${s.name} (${s.nationality || '-'}, Puan: ${s.rating ?? '-'})`}
              sx={{ fontSize: 16, p: 1, background: '#e3f2fd' }}
            />
          ))}
        </Box>
      </Card>
    </Box>
  )
}

export default ConferenceView 