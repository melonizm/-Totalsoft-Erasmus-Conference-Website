import { curry, without, intersection, isEmpty, not } from 'ramda'
import { validEmailRegEx } from "./constants"
export const modifyPath = (path, fn, obj) => {
  const clone = structuredClone(obj)
  let target = clone
  for (let i = 0; i < path.length - 1; i++) {
    target = target[path[i]]
  }
  target[path[path.length - 1]] = fn(target[path[path.length - 1]])
  return clone
}

export const generateDefaultFilters = () => {
  const startDate = new Date()
  const endDate = addDays(2, startDate)
  return {
    startDate,
    endDate
  }
}
export const extractExactAge = (birthday, referenceDate) => {
  var differenceInMilisecond = Date.parse(referenceDate) || Date.now() - Date.parse(birthday)

  var years = Math.floor(differenceInMilisecond / 31536000000)
  var days = Math.floor((differenceInMilisecond % 31536000000) / 86400000)
  var months = Math.floor(days / 30)

  days = days % 30

  if (isNaN(years) || isNaN(months) || isNaN(days)) {
    return {}
  } else {
    return {
      years,
      months,
      days
    }
  }
}

// valueOrDefault :: a -> a -> a
export const valueOrDefault = curry(($default, value) => value ?? $default)

// withoutItem :: a -> [a] -> [a]
export const withoutItem = curry((x, xs) => without([x], xs))

export const intersect = (needed = [], received = []) => not(isEmpty(intersection(needed, received)))

export const isNullOrWhitespace = str => !str || /^\s*$/.test(str)

// transformToDate :: String -> Date
export const transformToDate = str => new Date(str)

// addDays :: Int -> Date -> Date
export const addDays = curry((days, date) => {
  let localMutable = new Date(date)
  localMutable.setDate(localMutable.getDate() + days)
  return localMutable
})

// addOneDay :: Date -> Date
export const addOneDay = addDays(1)

// addMilliseconds :: Int -> Date -> Date
export const addMilliseconds = curry((milliseconds, date) => new Date(date.getTime() + milliseconds))

// subtractOneMillisecond :: Date -> Date
export const subtractOneMillisecond = addMilliseconds(-1)

// validateEmail :: String -> Boolean
export const validateEmail = email => validEmailRegEx.test(email)

export const getOidcConfigName = () => {
  const tid = 'config_show_access_token'
  return tid
}
