import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Form, InputGroup, InputGroupAddon, Input, Spinner, Button } from 'reactstrap'
import { connect } from 'react-redux'
import { getUserChat } from '../../../actions/chat'

const Chat = ({ userChat, getUserChat }) => {
  const { chat, loading, error } = userChat
  const { id } = useParams()

  useEffect(() => {
    getUserChat(id)
    //eslint-disable-next-line
  }, [])

  if (!chat) {
    if (loading) return <Spinner color="primary" className="d-block mx-auto mt-4" />
    if (error) return <p className="text-danger mt-4 text-center">{error.msg ? error.msg : error}</p>
    return null
  }

  return (
    <div className="side-area-container chat-container">
      <div className="d-flex align-items-end px-2">
        <Link to="/home/chats/" className="back-btn p-0 m-0">
          <i className="fa fa-chevron-left fa-lg"></i>
        </Link>
        <h4 className="text-center text-muted mx-auto pr-2 pr-sm-4 my-0">@{chat.receiver.username}</h4>
      </div>
      <hr />
      <div className="chat-box"></div>
      <hr />
      <Form className="message-box">
        <InputGroup>
          <Input />
          <InputGroupAddon addonType="append">
            <Button color="primary">Send</Button>
          </InputGroupAddon>
        </InputGroup>
      </Form>
    </div>
  )
}

const mapStateToProps = (state) => ({
  userChat: state.chat.userChat
})

const mapDispatchToProps = (dispatch) => ({
  getUserChat: (id) => dispatch(getUserChat(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
