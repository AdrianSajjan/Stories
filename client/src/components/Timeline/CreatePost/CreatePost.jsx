import React, { Fragment, useState } from "react";
import {
  Form,
  Input,
  Button,
  FormGroup,
  FormText,
  FormFeedback,
} from "reactstrap";
import DefaultImage from "../../../assets/images/sample-profile-picture.png";
import "./CreatePost.css";

const CreatePost = () => {
  // Create-Post
  const minRows = 2;
  const [post, setPost] = useState("");
  const [row, setRow] = useState(minRows);

  const HandleChange = (event) => {
    const input = event.target;
    const lineHeight = 20;
    const previousRows = input.rows;
    input.rows = minRows;
    const currentRows = ~~(input.scrollHeight / lineHeight);

    if (currentRows === previousRows) {
      input.rows = currentRows;
    }

    setRow(currentRows);
    setPost(input.value);
  };

  const HandleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Fragment>
      <Form className="p-4 post-form" onSubmit={HandleSubmit}>
        <div className="d-flex align-items-start justify-content-center">
          <img
            src={DefaultImage}
            alt="profile"
            className="timeline-profile-img"
          />
          <FormGroup className="w-100 ml-3">
            <Input
              type="textarea"
              name="post"
              placeholder="Write something..."
              rows={row.toString()}
              className="post-input p-0"
              maxLength="450"
              value={post}
              onChange={HandleChange}
              invalid={false}
            />
            <FormText className="text-right">{`${
              450 - post.length
            }/450`}</FormText>
            <FormFeedback invalid="true"></FormFeedback>
          </FormGroup>
        </div>
        <Button
          className="ml-auto mt-2 d-block btn-rounded px-3 text-uppercase"
          color="primary"
        >
          Post
        </Button>
      </Form>
    </Fragment>
  );
};

export default CreatePost;
