// Default settings which can be overidden with environment variables
module.exports = {
  port: process.env.PORT || 3000,
  dbhost: process.env.DB_HOST || "localhost",
  dbport: process.env.DB_PORT || 27017,
  dbname: process.env.DB_NAME || "urlshort",
  baseUrl: process.env.BASE_URL || "localhost:" + (process.env.PORT || 3000),
  shortlength: process.env.SHORT_LENGTH || 7,
  rootredirect: process.env.ROOT_REDIRECT || "/web/",
  gaPropertyId: process.env.GA_UA_ID,
}
