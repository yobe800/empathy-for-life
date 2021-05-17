import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";

import { DEFAULT_ERROR_MESSAGE } from "../constants/constants";
import logWarnOrErrInDevelopment from "../utils/logWarnOrErrInDevelopment";

import styles from "./styles/Posts.module.css";
import Container from "./shared/Container";
import ModalHeader from "./shared/ModalHeader";
import InputButton from "./shared/InputButton";
import Input from "./shared/Input";
import Post from "./shared/Post";
import CloseButton from "./shared/CloseButton";
import PopUpWindow from "./shared/PopUpWindow";

const Posts = () => {
  const [postDatum, setPostDatum] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const { modal } = history.location.state;

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${serverUrl}/posts`,
          { signal },
        );

        const { message, result } = await response.json();

        setShouldFetch(false);

        if (message === "ok") {
          setPostDatum(result);
        } else {
          setErrorMessage(message);
        }
      } catch (error) {
        logWarnOrErrInDevelopment(error);
        setErrorMessage(DEFAULT_ERROR_MESSAGE);
      }
    };

    fetchPosts();

    return () => controller.abort();
  }, [shouldFetch]);

  const handleModalClose = () => {
    history.push("/");
  };
  const handleClosePopUp = () => {
    setErrorMessage("");
  };

  const posts = postDatum.map(({ _id, writer: { user_name }, content, photo: { url }, updated_at }) => {
    const writtenDate = new Date(updated_at).toDateString();

    return (
      <Post
        key={_id}
        postId={_id}
        writer={user_name}
        content={content}
        imageSrc={url}
        writtenDate={writtenDate}
      />
    );
  });

  return (
    <Container>
      {errorMessage
        ? <div className={styles.popUpContainer}>
            <PopUpWindow
              text={errorMessage}
              onClick={handleClosePopUp}
            />
          </div>
        : null
      }
      <div className={styles.CloseButtonContainer}>
        <CloseButton onClick={handleModalClose}/>
      </div>
      <ModalHeader text={"게시글"}>
        <div className={styles.inputsContainer}>
          <Link to={{
            pathname: "/posts/new",
            state: { modal },
          }}>
            <InputButton
              type="button"
              text={"글쓰기"}
              style={{ fontSize }}
            />
          </Link>
          <Input
            inputAttr={{
              style: { fontSize },
              placeholder: "검색하기",
            }}
          />
        </div>
      </ModalHeader>
        <div className={styles.postsContainer}>
          {posts}
        </div>
    </Container>
  );
};

const fontSize = "1.5vh";

export default Posts;
