import React from 'react'
import { connect } from 'react-redux'
import { Spinner } from 'reactstrap'

const ChatList = ({ chat }) => {
  const {
    profile,
    chat: { messages }
  } = chat

  const getFormattedMessage = () => {
    const sender = messages[messages.length - 1].sender.user === profile.user ? profile.username : 'You'
    const message = `${sender}: ${messages[messages.length - 1].message}`
    return message
  }

  return (
    <button className="chat-list py-2">
      <img className="chat-avatar-lg" src={profile.avatar.url} alt="profile" />
      <div className="d-flex flex-column ml-4 align-items-start justify-content-center">
        <p className="text-secondary font-weight-bold leading-1 m-0">@{profile.username}</p>
        <p className="text-secondary m-0">{getFormattedMessage()}</p>
      </div>
    </button>
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
