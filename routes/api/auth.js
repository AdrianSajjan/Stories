const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../../models/User')
const auth = require('../../middleware/token-auth')

const { check, validationResult } = require('express-validator')
const { AUTHENTICATION, VALIDATION, SERVER } = require('../../config/errors')

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
    res.status(500).send(SERVER)
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
        type: VALIDATION,
        errors: errors.array({ onlyFirstError: true })
      })

    const { email, password } = req.body

    try {
      const user = await User.findOne({ email })

      if (!user)
        return res.status(404).json({
          type: AUTHENTICATION,
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
          type: AUTHENTICATION,
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

      jwt.sign(payload, process.env.ID_SECRET, (err, token) => {
        if (err) throw err
        res.json({ token, validated: user.validated })
      })
    } catch (err) {
      console.log(err.message)
      res.status(500).send(SERVER)
    }
  }
)

module.exports = router
