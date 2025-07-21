import { Table as OrigTable, Tbody as OrigTbody, Td as OrigTd, Th as OrigTh, Tr as OrigTr } from 'react-super-responsive-table'
import tableStyles from 'assets/jss/components/tableStyle'
import { styled } from '@mui/material'

export const Table = styled(OrigTable)(({ theme }) => {
  const className = tableStyles(theme)
  return className.table
})

export const ThButton = styled(OrigTh)(({ theme }) => {
  const className = tableStyles(theme)
  return className.thButtonColumn
})

export const ThCenteredButton = styled(OrigTh)(({ theme }) => {
  const className = tableStyles(theme)
  return className.thCenteredButton
})

export const TdCenteredButton = styled(OrigTd)(({ theme }) => {
  const className = tableStyles(theme)
  return className.tdCenteredButton
})

export const TdCentered = styled(OrigTd)(({ theme }) => {
  const className = tableStyles(theme)
  return className.tdCentered
})

export const Th = styled(OrigTh)(({ theme }) => {
  const className = tableStyles(theme)
  return className.th
})

export const Tbody = styled(OrigTbody)(({ theme }) => {
  const className = tableStyles(theme)
  return className.tableContent
})

export const Tr = styled(OrigTr)(({ theme }) => {
  const className = tableStyles(theme)
  return className.tr
})

export const Td = styled(OrigTd, { shouldForwardProp: prop => prop !== 'styled' })(({ theme, styled }) => {
  const className = tableStyles(theme)
  return { ...className.td, ...styled }
})