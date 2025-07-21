import { Navigate } from 'react-router'
import CustomRoute from 'components/routing/CustomRoute'
import Welcome from 'features/welcome/Welcome'
import ConferenceListContainer from 'features/conference/list/components/ConferenceListContainer'
import ConferenceContainer from 'features/conference/edit/components/ConferenceContainer'
import ConferenceView from 'features/conference/view/ConferenceView'

import { Forbidden, NotFound } from '@totalsoft/rocket-ui'

const routes = [
  
  { path: '/forbidden', element: <Forbidden /> },
  { path: '/', element: <Navigate replace to='/welcome' /> },
  { path: '/welcome', element: <CustomRoute isPrivate={false} component={Welcome} /> },
  { path: '/conferences/:id', element: <ConferenceContainer /> },
  { path: '/conferences', element: <ConferenceListContainer /> },
  { path: '/conferences/view/:id', element: <ConferenceView /> },
]
export const notLoggedInRoutes = [
  { path: '/welcome', element: <CustomRoute isPrivate={false} component={Welcome} /> },
  { path: '*', element: <Navigate replace to='/welcome' /> }
]

export default routes
