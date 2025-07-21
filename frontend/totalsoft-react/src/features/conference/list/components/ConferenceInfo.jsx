import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Grid, Typography } from '@mui/material'
import { Autocomplete, DateTime, TextField, Button } from '@totalsoft/rocket-ui'
import { useQuery, gql, useMutation } from '@apollo/client'
import { Box, Fade, Paper } from '@mui/material'
import { useToast } from '@totalsoft/rocket-ui'

const RequiredStar = () => (
  <Typography component="span" color="error" sx={{ ml: 0.5 }}>*</Typography>
)

const IS_CONFERENCE_TYPE_EXISTS = gql`
  query IsConferenceTypeExists($name: String!) {
    isConferenceTypeExists(name: $name)
  }
`
const IS_CATEGORY_EXISTS = gql`
  query IsCategoryExists($name: String!) {
    isCategoryExists(name: $name)
  }
`
const ADD_CONFERENCE_TYPE = gql`
  mutation AddConferenceType($name: String!, $code: String) {
    addConferenceType(name: $name, code: $code)
  }
`
const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!, $code: String) {
    addCategory(name: $name, code: $code)
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

const ConferenceInfo = props => {
  const { types, categories, conference, dispatch } = props
  const { t } = useTranslation()
  const { name, startDate, endDate, type, category } = conference
  const handleDispatch = actionType => value => dispatch({ type: actionType, payload: value })
  const showToast = useToast()
  const [addConferenceType] = useMutation(ADD_CONFERENCE_TYPE, { refetchQueries: ['ConferenceTypeList'] })
  const [addCategory] = useMutation(ADD_CATEGORY, { refetchQueries: ['CategoryList'] })

  // State for input focus
  const [typeInput, setTypeInput] = React.useState('')
  const [categoryInput, setCategoryInput] = React.useState('')
  const [typeFocus, setTypeFocus] = React.useState(false)
  const [categoryFocus, setCategoryFocus] = React.useState(false)

  // Apollo queries
  const { data: typeExistsData } = useQuery(IS_CONFERENCE_TYPE_EXISTS, {
    variables: { name: typeInput },
    skip: !typeInput,
    fetchPolicy: 'network-only'
  })
  const { data: categoryExistsData } = useQuery(IS_CATEGORY_EXISTS, {
    variables: { name: categoryInput },
    skip: !categoryInput,
    fetchPolicy: 'network-only'
  })

  const handleAddMissing = async () => {
    let added = false
    if (typeInput && !typeExistsData?.isConferenceTypeExists) {
      const res = await addConferenceType({ variables: { name: typeInput } })
      added = res.data?.addConferenceType
    }
    if (categoryInput && !categoryExistsData?.isCategoryExists) {
      const res = await addCategory({ variables: { name: categoryInput } })
      added = added || res.data?.addCategory
    }
    if (added) {
      showToast('Veritabanında bulunmayan veriler başarıyla kaydedildi', 'success')
    }
  }

  const hasMissing = (typeInput && !typeExistsData?.isConferenceTypeExists) || (categoryInput && !categoryExistsData?.isCategoryExists)

  return (
    <Grid container spacing={3}>
      <Grid item container lg={9} spacing={3}>
        <Grid item xs={12} sm={6} lg={4}>
          <TextField
            label={<>{t('Conference.Name')}<RequiredStar /></>}
            fullWidth
            value={name}
            onChange={handleDispatch('name')}
          />
        </Grid>
      </Grid>
      <Grid item container lg={12} spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} lg={3}>
          <DateTime
            label={<>{t('Conference.StartDate')}<RequiredStar /></>}
            showPicker='dateTime'
            value={startDate}
            onChange={handleDispatch('startDate')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DateTime
            label={<>{t('Conference.EndDate')}<RequiredStar /></>}
            showPicker='dateTime'
            value={endDate}
            onChange={handleDispatch('endDate')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={{ position: 'relative' }}>
          <InfoBubble
            show={typeFocus && !!typeInput}
            exists={typeExistsData?.isConferenceTypeExists}
            label={t('Conference.Type')}
          />
          <Autocomplete
            label={<>{t('Conference.Type')}<RequiredStar /></>}
            fullWidth
            isClearable
            isSearchable
            creatable
            options={types}
            value={type}
            onChange={handleDispatch('type')}
            inputValue={typeInput}
            onInputChange={(_, v) => setTypeInput(v)}
            onFocus={() => setTypeFocus(true)}
            onBlur={() => setTypeFocus(false)}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={{ position: 'relative' }}>
          <InfoBubble
            show={categoryFocus && !!categoryInput}
            exists={categoryExistsData?.isCategoryExists}
            label={t('Conference.Category')}
          />
          <Autocomplete
            label={<>{t('Conference.Category')}<RequiredStar /></>}
            fullWidth
            isClearable
            isSearchable
            creatable
            options={categories}
            value={category}
            onChange={handleDispatch('category')}
            inputValue={categoryInput}
            onInputChange={(_, v) => setCategoryInput(v)}
            onFocus={() => setCategoryFocus(true)}
            onBlur={() => setCategoryFocus(false)}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 2 }}>
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
            disabled={hasMissing || !(name && startDate && endDate && type && category)}
          >
            Devam Et
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

ConferenceInfo.propTypes = {
  types: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  conference: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default ConferenceInfo
