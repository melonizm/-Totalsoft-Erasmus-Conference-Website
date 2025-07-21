const UserApi = require('../features/user/dataSources/userApi')
const TenantIdentityApi = require('../features/tenant/dataSources/tenantIdentityApi')

module.exports.getDataSources = context => ({
  // Instantiate your data sources here. e.g.: userApi: new UserApi(context)
  userApi: new UserApi(context),
  tenantIdentityApi: new TenantIdentityApi(context)
})
