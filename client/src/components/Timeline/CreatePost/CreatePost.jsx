import React, { Fragment, useState } from 'react'
import { Form, Input, Button, FormGroup, FormText } from 'reactstrap'
import DefaultImage from '../../../assets/images/sample-profile-picture.png'
import { createPost } from '../../../actions/post'
import { connect } from 'react-redux'
import { useToasts } from 'react-toast-notifications'
import './CreatePost.css'

const CreatePost = ({ createPost, profile }) => {
  // Create-Post
  const minRows = 2
  const [post, setPost] = useState('')
  const [row, setRow] = useState(minRows)

  const { addToast } = useToasts()

  const HandleChange = (event) => {
    const input = event.target
    const lineHeight = 20
    const previousRows = input.rows
    input.rows = minRows
    const currentRows = ~~(input.scrollHeight / lineHeight)

    if (currentRows === previousRows) {
      input.rows = currentRows
    }

    setRow(currentRows)
    setPost(input.value)
  }

  const HandleSubmit = (event) => {
    event.preventDefault()
    createPost(post, addToast)
    setPost('')
  }

  const getProfileImage = () => {
    if (
      profile &&
      profile.avatar &&
      profile.avatar.url &&
      profile.avatar.url.length
    )
      return profile.avatar.url
    else return DefaultImage
  }

  return (
    <Fragment>
      <Form className="p-4 post-form" onSubmit={HandleSubmit}>
        <div className="d-flex align-items-start justify-content-center">
          <img
            src={getProfileImage()}
            alt="profile"
            className="timeline-profile-img"
          />
          <FormGroup className="w-100 ml-3">
            <Input
              type="textarea"
              name="content"
              placeholder="Write something..."
              rows={row.toString()}
              className="post-input p-0"
              maxLength="450"
              value={post}
              onChange={HandleChange}
            />
            <FormText className="text-right">{`${
              450 - post.length
            }/450`}</FormText>
          </FormGroup>
        </div>
        <Button
          className="ml-auto mt-2 d-block btn-rounded px-3 text-uppercase"
          color="primary"
          disabled={post.length > 0 ? false : true}
        >
          Post
        </Button>
      </Form>
    </Fragment>
  )
}

const mapDispatchToProps = (dispatch) => ({
  createPost: (data, addToast) => dispatch(createPost(data, addToast))
})

export default connect(null, mapDispatchToProps)(CreatePost)
