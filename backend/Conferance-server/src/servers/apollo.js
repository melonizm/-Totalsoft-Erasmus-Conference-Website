const { ApolloServer } = require('@apollo/server'),
  Koa = require('koa'),
  { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer'),
  { ApolloLoggerPlugin } = require('@totalsoft/pino-apollo'),
  bodyParser = require('koa-bodyparser'),
  {
    errorHandlingMiddleware,
    correlationMiddleware,
    loggingMiddleware,
  } = require('../middleware'),
  cors = require('@koa/cors'),
  { publicRoute } = require('../utils/functions'),
  ignore = require('koa-ignore'),
  { koaMiddleware } = require('@as-integrations/koa'),
  { schema, getDataSources, logger } = require('../startup'),
  { METRICS_ENABLED } = process.env,
  { createMetricsPlugin } = require('@totalsoft/metrics'),
  metricsEnabled = JSON.parse(METRICS_ENABLED)

const plugins = (httpServer, subscriptionServer) => {
  return [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    new ApolloLoggerPlugin({ logger, securedMessages: false }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await subscriptionServer.dispose()
          }
        }
      }
    },
    metricsEnabled ? createMetricsPlugin() : {}
  ]
}

const startApolloServer = async (httpServer, subscriptionServer) => {
  logger.info('Creating Apollo Server...')
  const apolloServer = new ApolloServer({
    schema,
    csrfPrevention: false,
    stopOnTerminationSignals: false,
    uploads: false,
    plugins: plugins(httpServer, subscriptionServer)
  })

  await apolloServer.start()

  const app = new Koa()
  app
    .use(loggingMiddleware)
    .use(errorHandlingMiddleware())
    .use(bodyParser())
    .use(correlationMiddleware())
    .use(cors({ credentials: true }))
  app.use(
    koaMiddleware(apolloServer, {
      context: async ({ ctx }) => {
        const { token, state, tenant, externalUser, request, requestSpan } = ctx
        const { cache } = apolloServer
        const dataSources = getDataSources({ ...ctx, cache })
        return {
          token,
          state,
          tenant,
          externalUser,
          request,
          requestSpan,
          logger,
          dataSources
        }
      }
    })
  )

  httpServer.on('request', app.callback())

  return apolloServer
}

module.exports = { startApolloServer, plugins }
