const express = require('express')
const ObjectID = require('mongoose').Types.ObjectId
const Profile = require('../../models/Profile')
const Chat = require('../../models/Chat')
const auth = require('../../middleware/token-auth')
const { check, validationResult } = require('express-validator')
const { VALIDATION, SERVER, NOTFOUND } = require('../../config/errors')

const router = express.Router()

/**
 * @route : POST /api/chats/
 * @desc : Send a message
 * @access : Private
 */
router.post('/:id', [auth, [check('message').not().isEmpty().withMessage('Message cannot be empty')]], async (req, res) => {
  const errors = validationResult(req)
  const senderID = req.user.id
  const receiptentID = req.params.id

  try {
    const sender = await Profile.findOne({ user: senderID })

    if (!sender)
      return res.status(400).json({
        type: NOTFOUND,
        msg: 'Please create your profile.'
      })

    if (!errors.isEmpty())
      return res.status(400).json({
        type: VALIDATION,
        errors: errors.array({ onlyFirstError: true })
      })

    const receiptent = await Profile.findOne({ user: receiptentID })

    if (!receiptent)
      return res.status(404).json({
        type: NOTFOUND,
        errors: [
          {
            msg: "User doesn't exist"
          }
        ]
      })

    if (!ObjectID.isValid(receiptentID) || new ObjectID(receiptentID) != receiptentID)
      return res.status(400).json({
        type: NOTFOUND,
        errors: [
          {
            msg: "User doesn't exist"
          }
        ]
      })

    if (senderID === receiptentID)
      return res.status(500).json({
        type: NOTFOUND,
        errors: [
          {
            msg: "You cant't message yourself"
          }
        ]
      })

    const chat = await Chat.find({
      participants: { $all: [{ $elemMatch: { user: senderID } }, { $elemMatch: { user: receiptentID } }] }
    })

    if (chat) {
      chat.messages.push({
        message: req.body.message,
        sender: senderID
      })
      await chat.save()

      return res.json(chat)
    }

    const chatData = {
      messages: [{ message: req.body.message, sender: senderID, timestamp: req.body.date ? req.body.date : new Date() }],
      participants: [{ user: senderID }, { user: receiptentID }]
    }

    chat = new Chat(chatData)
    const data = await chat.save()

    res.json(data)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(SERVER)
  }
})

/**
 * @route : GET /api/chats/
 * @desc : Get All Messages
 * @access : Private
 */
