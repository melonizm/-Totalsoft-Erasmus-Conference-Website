//env
process.chdir(`${__dirname}/..`)
const dotenv = require('dotenv')
const result = dotenv.config()
if (result.error) {
  console.warn('No .env file found in current working directory:', result.error)
  const path = `.env`
  const pathResult = dotenv.config({ path })
  if (pathResult.error) {
    console.warn('No .env file found in project root directory:', pathResult.error)
  }
}

if (process.env.NODE_ENV) {
  const nodeEnvResult = dotenv.config({ path: `./.env.${process.env.NODE_ENV}`, override: true })
  if (nodeEnvResult.error) {
    console.warn(`No .env.${process.env.NODE_ENV} file found in project root directory:`, nodeEnvResult.error)
  }
}

const keyPerFileEnv = require('@totalsoft/key-per-file-configuration')
const configMonitor = keyPerFileEnv.load()

require('console-stamp')(global.console, {
  format: ':date(yyyy/mm/dd HH:MM:ss.l)'
})

const { logger } = require('./startup'),
  { createServer } = require('http'),
  { startApolloServer, startSubscriptionServer } = require('./servers')

// Metrics, diagnostics
const { DIAGNOSTICS_ENABLED, METRICS_ENABLED } = process.env,
  diagnosticsEnabled = JSON.parse(DIAGNOSTICS_ENABLED),
  metricsEnabled = JSON.parse(METRICS_ENABLED),
  { startMetrics, startDiagnostics } = require('@totalsoft/metrics')

const httpServer = createServer()
const subscriptionServer = startSubscriptionServer(httpServer)
const apolloServerPromise = startApolloServer(httpServer, subscriptionServer)

const port = process.env.PORT || 4000
httpServer.listen(port, () => {
  logger.info(`🚀 Server ready at http://localhost:${port}/graphql`)
  logger.info(`🚀 Subscriptions ready at ws://localhost:${port}/graphql`)
})

async function cleanup() {
  await configMonitor?.close()
  await (await apolloServerPromise)?.stop()
}

const { gracefulShutdown } = require('@totalsoft/graceful-shutdown')
gracefulShutdown({
  onShutdown: cleanup,
  terminationSignals: ['SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2'],
  unrecoverableEvents: ['uncaughtException', 'unhandledRejection'],
  logger,
  timeout: 5000
})

diagnosticsEnabled && startDiagnostics(logger)
metricsEnabled && startMetrics(logger)
