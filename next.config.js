require('dotenv').config()

module.exports = {
  reactStrictMode: true,
  env: {
    GOOGLEMAP_APIKEY: process.env.GOOGLEMAP_APIKEY,
    MONGODB_URI: process.env.MONGODB_URI
  },
}
