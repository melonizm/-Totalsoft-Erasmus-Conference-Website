const { tenantService, tenantContextAccessor } = require('@totalsoft/multitenancy-core')

const isMultiTenant = JSON.parse(process.env.IS_MULTITENANT || 'false')

const tenantIdentification = () => async (ctx, next) => {
  const tenant = isMultiTenant ? await tenantService.getTenantFromId(getTenantIdFromQueryString(ctx)) : {}

  await tenantContextAccessor.useTenantContext({ tenant }, next)
}

// eslint-disable-next-line no-unused-vars
const getTenantIdFromQueryString = ({ request }) => request.query.tenantId

// eslint-disable-next-line no-unused-vars
const getTenantIdFromHeaders = ctx => ctx.req.headers.tenantid

// eslint-disable-next-line no-unused-vars
const getTenantIdFromHost = ctx => ctx.hostname

// eslint-disable-next-line no-unused-vars
const getTenantIdFromRefererHost = async ctx => {
  if (!ctx.request.headers.referer) {
    return
  }
  var url = new URL.parse(ctx.request.headers.referer)
  return url.hostname
}

module.exports = tenantIdentification
