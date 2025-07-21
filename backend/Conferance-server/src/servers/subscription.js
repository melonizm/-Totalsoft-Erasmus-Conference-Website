const jsonwebtoken = require('jsonwebtoken')
const { tenantService } = require('@totalsoft/multitenancy-core'),
  isMultiTenant = JSON.parse(process.env.IS_MULTITENANT || 'false')
const { WebSocketServer } = require('ws')
const WebSocket = require('ws') // workaround for opentelemetry-instrumentation-ws
const { correlation, tenantContext } = require('../subscriptions/middleware'),
  { subscribe } = require('../subscriptions')

const { GraphQLError } = require('graphql'),
  { useServer } = require('graphql-ws/lib/use/ws'),
  { validateWsToken } = require('../middleware'),
  { schema, logger, getDataSources } = require('../startup'),
  { recordSubscriptionStarted } = require('@totalsoft/metrics'),
  metricsEnabled = JSON.parse(process.env.METRICS_ENABLED)

logger.info('Creating Subscription Server...')
const startSubscriptionServer = httpServer =>
  useServer(
    {
      schema,
      onConnect: async ctx => {
        const connectionParams = ctx?.connectionParams
        const token = connectionParams.authorization.replace('Bearer ', '')
        if (!token) {
          throw new GraphQLError('401 Unauthorized', { extensions: { code: 'UNAUTHORIZED' } })
        }
        ctx.token = token

        await validateWsToken(token, ctx?.extra?.socket)

        const decoded = jsonwebtoken.decode(token)
        ctx.externalUser = {
          id: decoded?.sub,
          role: decoded?.role
        }

        if (isMultiTenant) {
          const tenantId = decoded?.tid
          ctx.tenant = await tenantService.getTenantFromId(tenantId)
        } else {
          ctx.tenant = {}
        }

        ctx.state = { token }
      },
      subscribe: subscribe({
        middleware: [correlation, tenantContext],
        filter: ctx => message => ctx?.tenant?.id?.toLowerCase() === message?.headers?.pubSubTenantId?.toLowerCase()
      }),
      onSubscribe: async (ctx, msg) => {
        await validateWsToken(ctx?.token, ctx?.extra?.socket)
        metricsEnabled && recordSubscriptionStarted(msg)
      },
      onDisconnect: (_ctx, code, reason) =>
        code != 1000 && logger.info(`Subscription server disconnected! Code: ${code} Reason: ${reason}`),
      onError: (ctx, msg, errors) => logger.error('Subscription error!', { ctx, msg, errors }),
      context: async (ctx, msg, _args) => {
        const { tenant } = ctx
        const dataSources = getDataSources(ctx)
        const subscriptionLogger = logger.child({ operationName: msg?.payload?.operationName })

        return {
          ...ctx,
          tenant,
          dataSources,
          logger: subscriptionLogger
        }
      }
    },
    new WebSocketServer({
      server: httpServer,
      path: '/graphql',
      WebSocket
    })
  )

module.exports = startSubscriptionServer
