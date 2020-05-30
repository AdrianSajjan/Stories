const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../../models/User')
const auth = require('../../middleware/token-auth')
const { generateTokens } = require('../../utils/OAuth2')
const { check, validationResult } = require('express-validator')

require('dotenv').config()
const router = express.Router()

/**
 * @route : GET api/auth
 * @desc : Return User Info
 * @access : Private
 */
router.get('/', auth, async (req, res) => {
  const userID = req.user.id

  try {
    const user = await User.findById(userID).select('-password')
    res.json(user)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Something Went Wrong! Please Try Again!')
  }
})

/**
 * @type: POST api/auth
 * @desc: Login an User
 * @access: Public
 */
router.post(
  '/',
  [
    check('email').not().isEmpty().withMessage('Email cannot be empty'),
    check('password').not().isEmpty().withMessage('Password cannot be empty')
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty())
      return res.status(400).json({
        validation: true,
        errors: errors.array({ onlyFirstError: true })
      })

    const { email, password } = req.body

    try {
      const user = await User.findOne({ email })

      if (!user)
        return res.status(404).json({
          authentication: true,
          errors: [
            {
              param: 'email',
              msg: "Account doesn't exist"
            }
          ]
        })

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch)
        return res.status(400).json({
          authentication: true,
          errors: [
            {
              param: 'password',
              msg: 'Password is incorrect'
            }
          ]
        })

      const payload = {
        user: {
          id: user.id
        }
      }

      const { access_token, refresh_token } = generateTokens(payload)

      res.json({ access_token, refresh_token, validated: user.validated })
    } catch (err) {
      console.log(err.message)
      res.status(500).send('Something Went Wrong! Please Try Again!')
    }
  }
)

/**
 * @type: Get api/auth/oauth2
 * @desc: Generate OAuth2 Tokens
 * @access: Public
 */
router.post('/oauth2', (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken)
      return res.status(401).json({
        authentication: true,
        msg: 'Not Authorized! Access Rejected.'
      })

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
    const { access_token, refresh_token } = generateTokens(decoded)

    res.json({ access_token, refresh_token })
  } catch (err) {
    res.status(401).json({
      authentication: true,
      msg: 'Token Invalid! Access Rejected.'
    })
  }
})

module.exports = router
