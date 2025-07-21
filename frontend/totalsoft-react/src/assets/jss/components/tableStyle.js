import styles from 'assets/jss/styles'

const tableStyles = theme => ({
  table: {
    ...theme?.table?.main,
    width: '-webkit-fill-available',
    '&.responsiveTable ': {
      '@media (max-width: 40em)': {
        '&tr': {
          border: 0,
          borderBottom: theme?.table?.tableContent?.borderBottom
        }
      }
    }
  },
  th: {
    ...theme?.table?.tableHeader,
    backgroundColor: styles(theme)?.transparent,
    color: styles(theme)?.primaryColor,
    whiteSpace: 'nowrap'
  },
  thButtonColumn: {
    ...theme?.table?.tableHeader,
    backgroundColor: styles(theme)?.transparent,
    color: styles(theme)?.primaryColor,
    whiteSpace: 'nowrap',
    width: '90px'
  },
  thCenteredButton: {
    ...theme?.table?.tableHeader,
    backgroundColor: styles(theme)?.transparent,
    color: styles(theme)?.primaryColor,
    whiteSpace: 'nowrap',
    textAlign: 'center',
    width: 'fit-content'
  },
  tr: {
    verticalAlign: 'middle',
    border: 'none !important',
    borderTop: '1px solid #eee !important'
  },
  td: {
    padding: '10px 10px 0px 10px'
  },
  tdCentered: {
    padding: '10px 10px 0px 10px',
    textAlign: 'center'
  },
  tdCenteredButton: {
    textAlign: 'center',
    width: 'fit-content'
  },
  tableContent: theme?.table?.tableContent,
  itemSelected: {
    ...theme?.table?.itemSelected
  },
  enableScrollX: {
    overflowX: 'auto',
    width: '100%'
  },
  editColumn: {
    width: '400px'
  }
})

export default tableStyles