const jwt = require('jsonwebtoken')

require('dotenv').config()

const generateTokens = (payload) => {
  const access_token = jwt.sign(payload, process.env.ACCESS_SECRET, {
    expiresIn: '1h'
  })

  const refresh_token = jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: '2d'
  })

  return { access_token, refresh_token }
}

module.exports = { generateTokens }
