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
  const [search, setSearch] = useState("");
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
      console.log(search);
      try {
        const response = await fetch(
          `${serverUrl}/posts?search=${search}`,
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

    const timeId = setTimeout(fetchPosts, 300);

    return () => {
      controller.abort();
      clearTimeout(timeId);
    };
  }, [shouldFetch, search]);

  const handleModalClose = () => {
    history.push("/");
  };
  const handleClosePopUp = () => {
    setErrorMessage("");
  };
  const handleSearch = (event) => {
    setShouldFetch(true);
    setSearch(event.target.value);
  };

  const posts = postDatum.map(({
    _id,
    writer: { user_name },
    content,
    photo: { url },
    updated_at
  }) => {
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
    <Container className={styles.container}>
      {errorMessage
        ? <PopUpWindow
            className={styles.popUp}
            text={errorMessage}
            onClick={handleClosePopUp}
          />
        : null
      }
      <CloseButton
        className={styles.CloseButton}
        onClick={handleModalClose}
      />
      <ModalHeader text={"게시글"}>
        <div className={styles.inputsContainer}>
          <Link
            className={styles.anchor}
            to={{
              pathname: "/posts/new",
              state: { modal },
            }}
          >
            <InputButton
              className={styles.writingButton}
              type="button"
              text={"글쓰기"}
            />
          </Link>
          <Input
            inputClassName={styles.search}
            inputAttr={{
              placeholder: "검색",
              onInput: handleSearch,
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

export default Posts;
