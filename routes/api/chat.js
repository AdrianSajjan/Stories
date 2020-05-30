const express = require('express')
const ObjectID = require('mongoose').Types.ObjectId
const Profile = require('../../models/Profile')
const Chat = require('../../models/Chat')
const auth = require('../../middleware/token-auth')
const { check, validationResult } = require('express-validator')

const router = express.Router()

/**
 * @route : POST /api/chats/
 * @desc : Send a message
 * @access : Private
 */
router.post(
  '/:id',
  [
    auth,
    [check('message').not().isEmpty().withMessage('Message cannot be empty')]
  ],
  async (req, res) => {
    const senderID = req.user.id
    const receiverID = req.params.id

    try {
      const sender = await Profile.findOne({ user: senderID })

      if (!sender)
        return res.status(400).json({
          notFound: true,
          msg: 'Please create your profile.'
        })

      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(400).json({
          validation: true,
          errors: errors.array({ onlyFirstError: true })
        })

      const receiver = await Profile.findOne({ user: receiverID })

      if (!receiver)
        return res
          .status(404)
          .json({ notFound: true, msg: "User doesn't exist" })

      if (
        !ObjectID.isValid(receiverID) ||
        new ObjectID(receiverID) != receiverID
      )
        return res
          .status(400)
          .json({ notFound: true, msg: "User doesn't exist" })

      if (senderID === receiverID)
        return res
          .status(500)
          .json({ notFound: true, msg: "You cant't message yourself" })

      let chat = await Chat.findOne({
        $and: [
          { 'participants.user': senderID },
          { 'participants.user': receiverID }
        ]
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
        return res.json({ receiver, chat })
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
          { user: receiverID, profile: receiver._id }
        ]
      }

      chat = new Chat(chatData)
      chat = await chat.save()

      res.json({ receiver, chat })
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Something Went Wrong! Please Try Again!')
    }
  }
)

/**
 * @route : GET /api/chats/
 * @desc : Get All Messages
 * @access : Private
 */
router.get('/', auth, async (req, res) => {
  const userID = req.user.id
  let allChats = []
  try {
    const chats = await Chat.find({ 'participants.user': userID }).populate(
      'participants.profile'
    )

    allChats = chats.map((chat) => {
      const participant = chat.participants.filter(
        (participant) => participant.user != userID
      )
      const profile = participant[0].profile

      chat.participants.forEach((participant) => {
        participant.profile = participant.profile._id
      })

      return { receiver: profile, chat }
    })

    res.json(allChats)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Something Went Wrong! Please Try Again!')
  }
})

/**
 * @route : GET /api/chats/:id
 * @desc : Get A Particular Chat
 * @access : Private
 */
router.get('/:id', auth, async (req, res) => {
  const userID = req.user.id
  const receiverID = req.params.id

  try {
    if (!ObjectID.isValid(receiverID) || new ObjectID(receiverID) != receiverID)
      return res.status(400).json({
        notFound: true,
        msg: "User doesn't exist"
      })

    const receiver = await Profile.findOne({ user: receiverID })

    if (!receiver)
      return res.status(404).json({
        notFound: true,
        msg: "User doesn't exist"
      })

    const chat = await Chat.findOne({
      //participants: { $all: [{ $elemMatch: { user: userID } }, { $elemMatch: { user: receiverID } }] }
      $and: [
        { 'participants.user': userID },
        { 'participants.user': receiverID }
      ]
    })

    res.json({ receiver, chat })
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Something Went Wrong! Please Try Again!')
  }
})

module.exports = router
