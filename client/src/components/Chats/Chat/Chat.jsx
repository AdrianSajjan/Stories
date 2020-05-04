import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import moment from 'moment'
import { Form, InputGroup, InputGroupAddon, Input, Spinner, Button } from 'reactstrap'
import { connect } from 'react-redux'
import { getUserChat, resetUserChat, sendMessage } from '../../../actions/chat'

const Chat = ({ userChat, getUserChat, sendMessage, currentProfile, resetUserChat }) => {
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

    sendMessage(message, id)
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

  return (
    <div className="side-area-container chat-container">
      <div className="d-flex align-items-center px-2">
        <Link to="/home/chats/" className="back-btn p-0 m-0">
          <i className="fa fa-chevron-left fa-lg"></i>
        </Link>
        <div className="mx-auto pr-2 pr-sm-4 d-flex align-items-center">
          <img src={chat.receiver.avatar.url} alt="profile" className="chat-avatar mr-1 my-0" />
          <p className="lead text-center text-muted mt-0 mb-1 ml-1">@{chat.receiver.username}</p>
        </div>
      </div>
      <hr />
      <div className="chat-box">
        <Messages chat={chat.chat} profile={currentProfile.profile} />
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

const Messages = ({ chat, profile }) => {
  const getBubbleClass = (sender) => {
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
  currentProfile: state.profile.currentProfile
})

const mapDispatchToProps = (dispatch) => ({
  getUserChat: (id) => dispatch(getUserChat(id)),
  resetUserChat: () => dispatch(resetUserChat()),
  sendMessage: (message, id) => dispatch(sendMessage(message, id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
