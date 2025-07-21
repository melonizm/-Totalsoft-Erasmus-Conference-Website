const { makeExecutableSchema } = require('@graphql-tools/schema')
const { loadFilesSync } = require('@graphql-tools/load-files')
const { mergeResolvers, mergeTypeDefs } = require('@graphql-tools/merge')
const { join } = require('path')
const { applyMiddleware } = require('graphql-middleware')

// Eğer JWT doğrulaması kaldırıldıysa permissionsMiddleware boş bir fonksiyon olarak tanımlı olabilir
const { permissionsMiddleware } = require('../middleware')

// 📁 .graphql dosyalarının hepsini (feature'lardan) yükle
const typeDefs = mergeTypeDefs(
  loadFilesSync(join(__dirname, '../features/**/*.graphql'))
)

// 📁 resolver dosyalarının hepsini yükle (.js veya .ts olabilir)
const resolvers = mergeResolvers(
  loadFilesSync(join(__dirname, '../features/**/*resolvers.{js,ts}'), {
    globOptions: { caseSensitiveMatch: false }
  })
)

// GraphQL şemasını oluştur ve middleware uygula (örneğin izin kontrolleri)
const executableSchema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissionsMiddleware
)

// 📤 Export schema and its raw components (for testing if needed)
module.exports = executableSchema
module.exports.tests = { typeDefs, resolvers }
