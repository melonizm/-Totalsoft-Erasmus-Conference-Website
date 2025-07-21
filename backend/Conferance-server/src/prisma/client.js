const { PRISMA_DEBUG, IS_MULTITENANT } = process.env
const { PrismaClient } = require('@prisma/client')
const { tenantContextAccessor } = require('@totalsoft/multitenancy-core')
const { tenantFilterExtension } = require('./tenancyExtension')
const isMultiTenant = JSON.parse(IS_MULTITENANT)
const isDebug = JSON.parse(PRISMA_DEBUG ?? false)

const cacheMap = new Map()
const prismaOptions = {
  log: isDebug ? ['query', 'info', 'warn', 'error'] : ['warn', 'error']
}

function prisma() {
  let prismaClient
  if (isMultiTenant) {
    const tenantContext = tenantContextAccessor.getTenantContext()
    const tenantId = tenantContext?.tenant?.id
    if (!tenantId) throw new Error(`Could not identify tenant!`)

    if (cacheMap.has(tenantId)) return cacheMap.get(tenantId)

    prismaClient = new PrismaClient(prismaOptions)
    prismaClient = tenantFilterExtension(prismaClient, tenantId)
    cacheMap.set(tenantId, prismaClient)
  } else {
    if (cacheMap.has('default')) return cacheMap.get('default')
    prismaClient = new PrismaClient(prismaOptions)
    cacheMap.set('default', prismaClient)
  }

  return prismaClient
}

module.exports = { prisma }
