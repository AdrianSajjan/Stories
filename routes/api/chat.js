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
  const senderID = req.user.id
  const receiptentID = req.params.id

  try {
    const sender = await Profile.findOne({ user: senderID })

    if (!sender)
      return res.status(400).json({
        type: NOTFOUND,
        msg: 'Please create your profile.'
      })

    const errors = validationResult(req)
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

    let chat = await Chat.findOne({
      //participants: { $all: [{ $elemMatch: { user: senderID } }, { $elemMatch: { user: receiptentID } }] }
      $and: [{ 'participants.user': senderID }, { 'participants.user': receiptentID }]
    })

    if (chat) {
      chat.messages.push({
        message: req.body.message,
        sender: {
          user: senderID,
          profile: sender._id
        }
      })
      await chat.save()
      return res.json({ receiptent, chat })
    }

    const chatData = {
      messages: [
        {
          message: req.body.message,
          sender: {
            user: senderID,
            profile: sender._id
          }
        }
      ],
      participants: [
        { user: senderID, profile: sender._id },
        { user: receiptentID, profile: receiptent._id }
      ]
    }

    chat = new Chat(chatData)
    chat = await chat.save()

    res.json({ receiptent, chat })
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
router.get('/', auth, async (req, res) => {
  const userID = req.user.id
  let allChats = []
  try {
    const chats = await Chat.find({ 'participants.user': userID }).populate('participants.profile')
    allChats = chats.map((chat) => {
      const participant = chat.participants.filter((participant) => participant.user != userID)
      const profile = participant[0].profile

      chat.participants.forEach((participant) => {
        participant.profile = participant.profile._id
      })

      return { profile, chat }
    })

    res.json(allChats)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(SERVER)
  }
})

/**
 * @route : GET /api/chats/:id
 * @desc : Get A Particular Chat
 * @access : Private
 */
router.get('/:id', auth, async (req, res) => {
  const userID = req.user.id
  const receiptentID = req.params.id

  try {
    if (!ObjectID.isValid(receiptentID) || new ObjectID(receiptentID) != receiptentID)
      return res.status(400).json({
        type: NOTFOUND,
        msg: "User doesn't exist"
      })

    const receiptent = await Profile.findOne({ user: receiptentID })

    if (!receiptent)
      return res.status(404).json({
        type: NOTFOUND,
        msg: "User doesn't exist"
      })

    const chat = await Chat.findOne({
      //participants: { $all: [{ $elemMatch: { user: userID } }, { $elemMatch: { user: receiptentID } }] }
      $and: [{ 'participants.user': userID }, { 'participants.user': receiptentID }]
    })

    res.json({ receiptent, chat })
  } catch (err) {
    console.log(err.message)
    res.status(500).send(SERVER)
  }
})

module.exports = router
