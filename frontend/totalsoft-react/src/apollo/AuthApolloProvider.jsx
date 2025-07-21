import PropTypes from 'prop-types'
import { ApolloProvider } from '@apollo/client'
import { useOidcUser, OidcUserStatus } from '@axa-fr/react-oidc'

import { getApolloClient } from './client'
import { getOidcConfigName } from 'utils/functions'

export function AuthApolloProvider({ children }) {
  const { oidcUserLoadingState } = useOidcUser(getOidcConfigName())

  if (oidcUserLoadingState === OidcUserStatus.Loading) {
    return <>auth loading</>
  }

  return <ApolloProvider client={getApolloClient()}>{children}</ApolloProvider>
}

AuthApolloProvider.propTypes = {
  children: PropTypes.element.isRequired
}

export default AuthApolloProvider
