import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { DEFAULT_ERROR_MESSAGE } from "../../../constants/constants";

import styles from "./styles.module.css";
import Button from "../Button/";
import PopUp from "../PopUp/";

const Post = ({
  postId,
  imageSrc,
  content,
  writer,
  writtenDate,
  fetchPost,
  hasEditRight,
}) => {
  const [hasConfirmDeletion, setHasConfirmDeletion] = useState(false);
  const [shouldDeletePost, setShouldDeletePost] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { pathname, state: { modal } } = useLocation();

  useEffect(() => {
    if (!shouldDeletePost) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const deletePost = async () => {
      try {
        const response = await fetch(
          `${serverUrl}/posts/${postId}`,
          {
            method: "DELETE",
            credentials: "include",
            signal
          },
        );
        const { message } = await response.json();

        setShouldDeletePost(false);

        if (message === "ok") {
          fetchPost();
        } else {
          setErrorMessage(message);
        }
      } catch (error) {
        setShouldDeletePost(false);
        setErrorMessage(DEFAULT_ERROR_MESSAGE);
      }
    };

    deletePost();

  }, [shouldDeletePost, postId, fetchPost]);

  const handlePostDelete = () => {
    if (shouldDeletePost) {
      return;
    }
    setShouldDeletePost(true);
  };
  const handleConfirm = () => {
    setHasConfirmDeletion(true);
  };
  const handleClosePopUp = () => {
    setErrorMessage("");
    setHasConfirmDeletion(false);
  };

  return (
    <div className={styles.container}>
      {hasConfirmDeletion
        ? <PopUp
            text={errorMessage || "삭제하시겠습니까?"}
            onClick={handleClosePopUp}
          >
            {errorMessage
              ? null
              : <Button
                  className={styles.deletionConfirmButton}
                  type="button"
                  text="확인"
                  onClick={handlePostDelete}
                />
            }
          </PopUp>
        : null
      }
      <img className={styles.photo} src={imageSrc} alt="post" />
      <p className={styles.content}>{content}</p>
      <div className={styles.footer}>
        {hasEditRight
          ? <div className={styles.buttonContainer}>
              <Link
                className={styles.anchor}
                to={{
                  pathname: `${pathname}/edit/${postId}`,
                  state: { modal }
                }}
              >
                <Button
                  className={styles.button}
                  type="button"
                  text="편집"
                />
              </Link>
                <Button
                  className={styles.button}
                  type="button"
                  text="삭제"
                  onClick={handleConfirm}
                />
            </div>
          : null
        }
        <span className={styles.footerText}>글쓴이 {writer} {writtenDate}</span>
      </div>
    </div>
  );
};

export default Post;
