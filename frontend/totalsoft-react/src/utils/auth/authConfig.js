import { TokenRenewMode } from '@axa-fr/react-oidc'
import { env } from 'utils/env'

export const root = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`
const AUTH = {
  CALLBACK: '/authentication/callback',
  SILENT_CALLBACK: '/authentication/silent_callback'
}

const getAuthenticationConfiguration = () => {
  return {
    client_id: env.VITE_APP_IDENTITY_CLIENT_ID,
    authority: env.VITE_APP_IDENTITY_AUTHORITY,
    redirect_uri: `${root}${AUTH.CALLBACK}`,
    silent_redirect_uri: `${root}${AUTH.SILENT_CALLBACK}`,
    scope: 'openid profile ' + env.VITE_APP_IDENTITY_SCOPE,
    refresh_time_before_tokens_expiration_in_second: 40,
    token_renew_mode: TokenRenewMode.access_token_invalid,
    service_worker_relative_url: '/OidcServiceWorker.js'
  }
}

export default getAuthenticationConfiguration
