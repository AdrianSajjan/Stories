const jwt = require('jsonwebtoken')

require('dotenv').config()

const auth = (req, res, next) => {
  const access_token = req.header('access-token')

  if (!access_token) {
    return res.status(401).json({
      authentication: true,
      msg: 'Not Authorized! Access Rejected.'
    })
  }

  try {
    const decoded = jwt.verify(access_token, process.env.ACCESS_SECRET)
    req.user = decoded.user
    next()
  } catch (err) {
    console.log('Access:')
    console.log(err.message)
    return res.status(401).json({
      authentication: true,
      msg: 'Token Invalid! Access Rejected.'
    })
  }
}

module.exports = auth
