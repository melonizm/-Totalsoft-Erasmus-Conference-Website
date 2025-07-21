import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import App from 'components/App'
import routes from './config'
import { useEmail } from 'hooks/useEmail'
import { notLoggedInRoutes } from './config.jsx'
export default function Root() {
  const [email] = useEmail()
  const routesUsed = email ? routes : notLoggedInRoutes
  const router = createBrowserRouter([{ element: <App />, children: routesUsed }])

  return <RouterProvider router={router} />
}
