import 'url-search-params-polyfill'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Root from './routes/root'
import ThemeProvider from 'providers/ThemeProvider'
import 'utils/i18n'
import './assets/css/index.css'
import 'moment/locale/ro'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { AreasWrapper } from './providers/AreasProvider'
import getTheme from './utils/theme'

import AuthApolloProvider from 'apollo/AuthApolloProvider'
import AuthProvider from 'providers/AuthenticationProvider'

const theme = getTheme()
const container = document.getElementById('root')
Object.assign(container.style, { ...theme.typography.defaultFont, color: theme.palette.primary.main })
const root = createRoot(container)

root.render(
  <StrictMode>
    <ThemeProvider>
      <AreasWrapper>
        <AuthProvider>
          <AuthApolloProvider>
            <Root />
          </AuthApolloProvider>
        </AuthProvider>
      </AreasWrapper>
    </ThemeProvider>
  </StrictMode>
)
