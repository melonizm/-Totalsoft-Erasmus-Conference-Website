const { shield, and } = require('graphql-shield')
const { isAuthenticated, isAdmin } = require('./rules')
const { GraphQLError } = require('graphql')

const permissionsMiddleware = shield(
  {
    User: {
      rights: isAuthenticated
    },
    Query: {
      userList: isAuthenticated
    },
    Mutation: {
      updateUser: and(isAuthenticated, isAdmin)
    }
  },
  {
    debug: true,
    allowExternalErrors: true,
    fallbackError: (_thrownThing, _parent, _args, _context, info) => {
      return new GraphQLError(
        `You are not authorized to execute this operation! [operation name: "${info.operation.name.value || ''}, field: ${info.fieldName}"]`,
        { extensions: { code: 'ERR_INTERNAL_SERVER' } }
      )
    }
  }
)

module.exports = { permissionsMiddleware }
