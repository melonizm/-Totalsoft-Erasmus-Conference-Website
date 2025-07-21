import PropTypes from 'prop-types'
import { MenuItem, Select, Typography } from './ThemeStyle'
import { useCallback, useState } from 'react'
import { Palette } from '@mui/icons-material'

function EmptyElement() {
  return <span></span>
}

const ThemeSelector = ({ drawerOpen }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('themeMode') || 'default'
  })
  
  const iconComponent = !drawerOpen ? { IconComponent: EmptyElement } : {}

  const changeTheme = useCallback(
    event => {
      const newTheme = event.target.value
      setCurrentTheme(newTheme)
      localStorage.setItem('themeMode', newTheme)
      // Sayfayı yenile
      window.location.reload()
    },
    []
  )

  const themeOptions = [
    { value: 'default', label: 'Varsayılan', color: '#666666' },
    { value: 'green', label: 'Yeşil', color: '#4CAF50' },
    { value: 'blue', label: 'Mavi', color: '#2196F3' },
    { value: 'orange', label: 'Turuncu', color: '#FF9800' },
    { value: 'red', label: 'Kırmızı', color: '#F44336' },
    { value: 'vividOrange', label: 'Canlı Turuncu', color: '#FF5722' },
    { value: 'lightBlue', label: 'Açık Mavi', color: '#03DAC6' }
  ]

  return (
    <Select value={currentTheme} onChange={changeTheme} {...iconComponent} variant='standard' drawerOpen={drawerOpen}>
      {themeOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Palette style={{ margin: '0px 7px', fontSize: '16px', color: option.color }} />
          {drawerOpen && <Typography style={{ color: option.color }}>{option.label}</Typography>}
        </MenuItem>
      ))}
    </Select>
  )
}

ThemeSelector.propTypes = {
  drawerOpen: PropTypes.bool
}

export default ThemeSelector 