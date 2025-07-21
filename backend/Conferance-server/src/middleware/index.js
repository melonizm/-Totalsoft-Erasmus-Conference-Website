const correlationMiddleware = require('./correlation/correlationMiddleware')
const validateToken = require('./auth/auth')
const errorHandlingMiddleware = require('./errorHandling/errorHandlingMiddleware')
const tenantIdentification = require('./tenantIdentification')
const loggingMiddleware = require('./logger/loggingMiddleware')
const permissionsMiddleware = require('./permissions')

module.exports = {
  ...validateToken,
  ...permissionsMiddleware,
  tenantIdentification,
  correlationMiddleware,
  errorHandlingMiddleware,
  loggingMiddleware
}
