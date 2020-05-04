import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Spinner } from 'reactstrap'

const ChatList = ({ chat }) => {
  const {
    receiver,
    chat: { messages }
  } = chat

  const getFormattedMessage = () => {
    const sender = messages[messages.length - 1].sender.user === receiver.user ? receiver.username : 'You'
    const message = `${sender}: ${messages[messages.length - 1].message}`
    return message
  }

  return (
    <Link to={`/home/chats/${receiver.user}`} className="chat-list py-2">
      <img className="chat-avatar-lg" src={receiver.avatar.url} alt="receiver" />
      <div className="d-flex flex-column ml-4 align-items-start justify-content-center">
        <p className="text-secondary font-weight-bold leading-1 m-0">@{receiver.username}</p>
        <p className="text-secondary m-0">{getFormattedMessage()}</p>
      </div>
    </Link>
  )
}

const ChatLists = ({ allChats }) => {
  const { chats } = allChats

  if (!chats || chats.length === 0) return <Spinner color="primary" className="d-block mt-4 mx-auto" />

  return (
    <div className="side-area-container chat-list-container">
      <h3 className="text-center text-muted">All Chats</h3>
      {chats.map((chat, index) => (
        <ChatList key={index} chat={chat} />
      ))}
    </div>
  )
}

const mapStateToProps = (state) => ({
  allChats: state.chat.allChats
})

export default connect(mapStateToProps)(ChatLists)
