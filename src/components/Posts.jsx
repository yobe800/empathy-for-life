import React, { useEffect, useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";

import { ReducerContext, selectors } from "../features/rootSlice";

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
import Loading from "./shared/Loading";

const Posts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [postDatum, setPostDatum] = useState({ posts: [], next: null });
  const [shouldFetch, setShouldFetch] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { state } = useContext(ReducerContext);
  const isAdministrator = selectors.getIsAdministrator(state);
  const userId = selectors.getUserId(state);
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
          `${serverUrl}/posts?search=${search}`,
          {
            credentials: "include",
            signal
          },
        );

        const { message, result, next } = await response.json();

        setShouldFetch(false);

        if (message === "ok") {
          setPostDatum({ posts: result, next });
        } else {
          setErrorMessage(message);
        }
      } catch (error) {
        logWarnOrErrInDevelopment(error);
        setErrorMessage(DEFAULT_ERROR_MESSAGE);
      } finally {
        setIsLoading(false);
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

  const postComponents = postDatum.posts.map(({
    _id,
    writer: { user_name, _id: writerId },
    content,
    photo: { url },
    updated_at
  }) => {
    const writtenDate = new Date(updated_at).toDateString();
    const hasEditRight = isAdministrator || writerId === userId;

    return (
      <Post
        key={_id}
        postId={_id}
        writer={user_name}
        content={content}
        imageSrc={url}
        writtenDate={writtenDate}
        fetchPost={() => setShouldFetch(true)}
        hasEditRight={hasEditRight}
      />
    );
  });

  if (!postComponents.length) {
    postComponents.push(
      <p key="notice" className={styles.notice}>게시글이 없습니다 😥</p>,
    );
  }

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
          {isLoading
            ? <Loading className={styles.loading} />
            : postComponents
          }
        </div>
    </Container>
  );
};

export default Posts;
