const jwt = require('jsonwebtoken')
require('dotenv').config()
const { AUTHENTICATION } = require('../config/errors')

const auth = (req, res, next) => {
  const token = req.header('x-auth-token')

  if (!token)
    return res.status(403).json({
      type: AUTHENTICATION,
      error: {
        msg: 'Not Authorized! Access Rejected.'
      }
    })

  try {
    const decoded = jwt.verify(token, process.env.ID_SECRET)
    req.user = decoded.user
    next()
  } catch (err) {
    return res.status(403).json({
      type: AUTHENTICATION,
      error: {
        msg: 'Token Invalid! Access Rejected.'
      }
    })
  }
}

module.exports = auth
