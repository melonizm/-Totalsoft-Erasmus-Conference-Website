const { getDataSources } = require('./dataSources')
const schema = require('./schema')
const logger = require('./logger')

module.exports = {
  schema,
  getDataSources,
  logger
}
