const jwt = require('jsonwebtoken')
const { AUTHENTICATION } = require('../config/errors')

require('dotenv').config()

const auth = (req, res, next) => {
  const token = req.header('access-token')

  if (!token)
    return res.status(401).json({
      type: AUTHENTICATION,
      msg: 'Not Authorized! Access Rejected.'
    })

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET)
    req.user = decoded.user
    next()
  } catch (err) {
    return res.status(401).json({
      type: AUTHENTICATION,
      msg: 'Token Invalid! Access Rejected.'
    })
  }
}

module.exports = auth
