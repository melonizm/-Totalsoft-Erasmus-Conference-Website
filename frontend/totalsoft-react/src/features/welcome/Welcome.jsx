import React, { useCallback, useState } from 'react'
import { IconButton, TextField, Typography } from '@totalsoft/rocket-ui'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import { useEmail } from 'hooks/useEmail'
import { validateEmail } from 'utils/functions'
import { emptyString } from 'utils/constants'

function Welcome() {
  const { t } = useTranslation()
  const [email, setEmail] = useEmail()
  const [textFieldValue, setTextFieldValue] = useState(email)
  const [isValid, setIsValid] = useState(true)
  const handleButtonClick = useCallback(() => {
  const isEmailValid = validateEmail(textFieldValue)
    setEmail(isEmailValid ? textFieldValue : emptyString)
    setIsValid(isEmailValid) // <<== this is the extra line
    }, [setEmail, textFieldValue])

  const handleKeyDown = useCallback(
    event => {
      if (event.keyCode === 13) {
        handleButtonClick()
      }
    },
    [handleButtonClick]
  )

  return (
    <Grid container justify='center' alignItems='center' alignContent='center' direction='column' spacing={10}>
      <Grid item xs={4}>
        <Typography variant='h5'>{t('LandingPage.Title')}</Typography>
      </Grid>
      <Grid item container justify='center' alignItems='center' alignContent='center' direction='column' spacing={1}>
        <Grid item xs={12}>
          <Typography variant='caption'>{t('LandingPage.Subtitle')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            endAdornment={
              <IconButton size='tiny' color='secondary' aria-label='go' onClick={handleButtonClick}>
                <KeyboardReturnIcon fontSize='small' />
              </IconButton>
            }
            value={textFieldValue}
            onChange={setTextFieldValue}
            onKeyDown={handleKeyDown}
            helperText={!isValid && t("LandingPage.BadEmail")}
            error={!isValid}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Welcome