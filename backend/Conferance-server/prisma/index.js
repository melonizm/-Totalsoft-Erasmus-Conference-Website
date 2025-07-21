const { PrismaClient } = require('@prisma/client')

let prisma = null

module.exports.prisma = () => {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}
