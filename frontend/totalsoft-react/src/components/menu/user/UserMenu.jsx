import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useOidcUser, useOidc } from '@axa-fr/react-oidc'
import { Collapse, Stack, Tooltip } from '@mui/material'
import { PowerSettingsNew } from '@mui/icons-material'
import LanguageSelector from '../languageSelector/LanguageSelector'
import ThemeSelector from '../themeSelector/ThemeSelector'
import avatar_default from 'assets/img/default-avatar.png'
import { root } from 'utils/auth/authConfig'
import { getOidcConfigName } from 'utils/functions'
import userMenuItems from 'constants/userMenuConfig'
import { Avatar, StyledListItem } from './UserMenuStyle'
import {
  ListItemIcon,
  ListItemText,
  StyledArrowDropDown,
  StyledArrowDropUp,
  StyledList,
  StyledNavLink
} from '../MenuStyle'
import MenuItem from '../MenuItem'
import { useEmail } from 'hooks/useEmail'

function UserMenu({ drawerOpen, avatar, withGradient }) {
  const [openAvatar, setOpenAvatar] = useState(false)
  const { t } = useTranslation()
  const location = useLocation()
  const { oidcUser } = useOidcUser(getOidcConfigName())
  const { logout } = useOidc(getOidcConfigName())
  const [email] = useEmail()

  const userName = oidcUser?.profile?.firstName
    ? `${oidcUser.profile.name} ${oidcUser.profile.lastName}`
    : oidcUser?.name
      ? oidcUser.name.split('@')[0]
      : 'User'

  const displayName = email || userName

  const activeRoute = useCallback(
    routeName => location.pathname.indexOf(routeName) > -1,
    [location.pathname]
  )

  const openCollapseAvatar = useCallback(
    e => {
      setOpenAvatar(!openAvatar)
      e.preventDefault()
    },
    [openAvatar]
  )

  const logoutAction = useCallback(
    e => {
      e.preventDefault()
      logout(root)
    },
    [logout]
  )

  return (
    <StyledList>
      <StyledNavLink to='/' withGradient={withGradient} onClick={openCollapseAvatar}>
        <ListItemIcon>
          <Avatar src={avatar ? avatar : avatar_default} alt='...' />
        </ListItemIcon>
        <ListItemText
          primary={
            <Stack direction='row'>
              {displayName}
              {openAvatar ? <StyledArrowDropUp /> : <StyledArrowDropDown />}
            </Stack>
          }
          disableTypography={true}
          drawerOpen={drawerOpen}
        />
      </StyledNavLink>

      <Collapse in={openAvatar} unmountOnExit>
        <StyledList>
          {userMenuItems.map((userMenu, key) => (
            <MenuItem
              key={key}
              menu={userMenu}
              drawerOpen={drawerOpen}
              activeRoute={activeRoute}
              withGradient={withGradient}
            />
          ))}

          {oidcUser && (
            <Tooltip disableHoverListener={drawerOpen} title={t('Tooltips.Logout')} placement='right'>
              <StyledNavLink to='/' withGradient={withGradient} onClick={logoutAction}>
                <ListItemIcon>
                  <PowerSettingsNew />
                </ListItemIcon>
                <ListItemText
                  primary={t('Tooltips.Logout')}
                  disableTypography={true}
                  drawerOpen={drawerOpen}
                />
              </StyledNavLink>
            </Tooltip>
          )}

          <StyledListItem withGradient={withGradient} drawerOpen={drawerOpen}>
            <ThemeSelector drawerOpen={drawerOpen} />
          </StyledListItem>

          <StyledListItem withGradient={withGradient} drawerOpen={drawerOpen}>
            <LanguageSelector drawerOpen={drawerOpen} />
          </StyledListItem>
        </StyledList>
      </Collapse>
    </StyledList>
  )
}

UserMenu.propTypes = {
  avatar: PropTypes.string,
  drawerOpen: PropTypes.bool.isRequired,
  withGradient: PropTypes.bool.isRequired
}

export default UserMenu
