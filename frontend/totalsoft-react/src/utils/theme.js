import { env } from './env'
import { defaultTheme, greenTheme, blueTheme, orangeTheme, redTheme, vividOrangeTheme, lightBlueTheme } from '@totalsoft/rocket-ui'

const getTheme = () => {
  // localStorage'dan tema seçimini oku
  let themeChoice = 'default'
  try {
    themeChoice = localStorage.getItem('themeMode') || 'default'
  } catch {}

  switch (themeChoice) {
    case 'green':
      return greenTheme
    case 'blue':
      return blueTheme
    case 'orange':
      return orangeTheme
    case 'red':
      return redTheme
    case 'vividOrange':
      return vividOrangeTheme
    case 'lightBlue':
      return lightBlueTheme
    default:
      return defaultTheme
  }
}

export default getTheme
