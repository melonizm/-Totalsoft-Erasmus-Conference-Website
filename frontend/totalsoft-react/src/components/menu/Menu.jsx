import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router'
import MenuItem from './MenuItem'
import CollapsibleMenuItem from './CollapsibleMenuItem'
import { StyledList } from './MenuStyle'
import menuItems from 'constants/menuConfig'

function Menu({ drawerOpen, withGradient }) {
  const location = useLocation()
  const activeRoute = useCallback(routeName => location.pathname.indexOf(routeName) > -1, [location.pathname])

  return (
    <nav>
      <StyledList>
        {menuItems.map((menu, key) => {
          const menuItemProps = { menu, drawerOpen, activeRoute, withGradient }
          return menu.children ? <CollapsibleMenuItem key={key} {...menuItemProps} /> : <MenuItem key={key} {...menuItemProps} />
        })}
      </StyledList>
    </nav>
  )
}

Menu.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  withGradient: PropTypes.bool.isRequired
}

export default Menu
