import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import moment from 'moment'
import { Form, InputGroup, InputGroupAddon, Input, Spinner, Button } from 'reactstrap'
import { connect } from 'react-redux'
import { getUserChat, resetUserChat, sendMessage } from '../../../actions/chat'
import DefaultImage from '../../../assets/images/sample-profile-picture.png'

const Chat = ({ userChat, getUserChat, sendMessage, currentProfile, resetUserChat, socket }) => {
  const { chat, loading, error } = userChat
  const { id } = useParams()

  const [message, setMessage] = useState('')
  const bottomRef = useRef(null)

  const isDisabled = () => {
    return message.length === 0
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (message.length === 0) return
    sendMessage(message, id, socket, currentProfile.profile)
    setMessage('')
  }

  useEffect(() => {
    getUserChat(id)

    return () => {
      resetUserChat()
    }
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (bottomRef.current !== null) {
      bottomRef.current.scrollIntoView()
    }
    //eslint-disable-next-line
  }, [userChat, bottomRef.current])

  if (currentProfile.profile === null) {
    if (currentProfile.loading) return <Spinner color="primary" className="d-block mx-auto mt-4" />
    else return <p className="text-danger mt-4 text-center">Please create your profile</p>
  }

  if (!chat) {
    if (loading) return <Spinner color="primary" className="d-block mx-auto mt-4" />
    if (error) return <p className="text-danger mt-4 text-center">{error.msg ? error.msg : error}</p>
    return null
  }

  const getProfileImage = () => {
    if (chat.receiver.avatar && chat.receiver.avatar.url && chat.receiver.avatar.url.length) return chat.receiver.avatar.url
    else return DefaultImage
  }

  return (
    <div className="side-area-container chat-container">
      <div className="d-flex align-items-center px-2">
        <Link to="/home/chats/" className="back-btn p-0 m-0">
          <i className="fa fa-chevron-left fa-lg"></i>
        </Link>
        <div className="mx-auto pr-2 pr-sm-4 d-flex align-items-center">
          <img src={getProfileImage()} alt="profile" className="chat-avatar mr-1 my-0" />
          <p className="lead text-center text-muted mt-0 mb-1 ml-1">@{chat.receiver.username}</p>
        </div>
      </div>
      <hr />
      <div className="chat-box">
        <Messages chat={chat.chat} receiver={chat.receiver} profile={currentProfile.profile} />
        <div className="ref-div" ref={bottomRef}></div>
      </div>
      <hr />
      <Form className="message-box" onSubmit={onSubmit}>
        <InputGroup>
          <Input name="message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <InputGroupAddon addonType="append">
            <Button color="primary" disabled={isDisabled()}>
              Send
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </Form>
    </div>
  )
}

const Messages = ({ chat, receiver, profile }) => {
  const getBubbleClass = (sender) => {
    console.log(`sender: ${sender.user}`)
    console.log(profile.user)
    console.log(sender.user === profile.user._id)
    if (sender.user === profile.user._id) return 'message-bubble ml-auto d-flex flex-column align-items-end'
    else return 'message-bubble mr-auto d-flex flex-column align-items-start'
  }

  const getDate = (timestamp) => {
    const msgDate = moment(timestamp).format('Do MMM YYYY')
    const msgTime = moment(timestamp).format('hh:mm a')
    const currentDate = moment().format('Do MMM YYYY')

    if (msgDate === currentDate) return `${msgTime}`
    else return `${msgDate}, ${msgTime}`
  }

  if (!chat) return <p className="text-center text-primary mt-2">Say Hi to @{receiver.username}</p>

  return (
    <div className="message-bubble-container">
      {chat.messages.map((message, index) => (
        <div key={index} className={getBubbleClass(message.sender)}>
          <p className="message-bubble-text rounded py-1 px-3">{message.message}</p>
          <small className="text-muted">{getDate(message.timestamp)}</small>
        </div>
      ))}
    </div>
  )
}

const mapStateToProps = (state) => ({
  userChat: state.chat.userChat,
  currentProfile: state.profile.currentProfile,
  socket: state.auth.socket
})

const mapDispatchToProps = (dispatch) => ({
  getUserChat: (id) => dispatch(getUserChat(id)),
  resetUserChat: () => dispatch(resetUserChat()),
  sendMessage: (message, id, socket, profile) => dispatch(sendMessage(message, id, socket, profile))
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
