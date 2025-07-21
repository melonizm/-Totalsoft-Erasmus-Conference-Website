// JWT ve jwks-rsa ile ilgili kodlar kaldırıldı
const jwtTokenValidation = (ctx, next) => next();
const jwtTokenUserIdentification = async (ctx, next) => next();
const validateToken = (token) => true;
const validateWsToken = (token, socket) => true;

module.exports = { jwtTokenValidation, jwtTokenUserIdentification, validateToken, validateWsToken };
