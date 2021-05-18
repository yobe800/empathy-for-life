import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import { DEFAULT_ERROR_MESSAGE } from "../../constants/constants";

import styles from "../styles/Post.module.css";
import InputButton from "./InputButton";
import PopUpWindow from "./PopUpWindow";

const Post = ({ postId, imageSrc, content, writer, writtenDate }) => {
  const [hasConfirmDeletion, setHasConfirmDeletion] = useState(false);
  const [shouldDeletePost, setShouldDeletePost] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const { pathname, state: { modal } } = history.location;
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
          { method: "DELETE", signal },
        );
        const { message } = await response.json();

        if (message === "ok") {
          return history.push("/");
        } else {
          setErrorMessage(message);
        }
      } catch (error) {
        setErrorMessage(DEFAULT_ERROR_MESSAGE);
      } finally {
        setShouldDeletePost(false);
      }
    };

    deletePost();

  }, [shouldDeletePost, postId, history, modal]);

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
        ? <PopUpWindow
            text={errorMessage || "삭제하시겠습니까?"}
            onClick={handleClosePopUp}
          >
            {errorMessage
              ? null
              : <InputButton
                  type="button"
                  text="확인"
                  style={{ ...buttonStyle, position: "absolute", left: "40%", bottom: "15%"}}
                  onClick={handlePostDelete}
                />
            }
          </PopUpWindow>
        : null
      }
      <img className={styles.photo} src={imageSrc} alt="post" />
      <p className={styles.content}>{content}</p>
      <div className={styles.footer}>
        <div className={styles.buttons}>
          <Link to={{ pathname: `${pathname}/edit/${postId}`, state: { modal }}}>
            <InputButton
              type="button"
              text="편집"
              style={buttonStyle}
            />
          </Link>
            <InputButton type="button" text="삭제" style={buttonStyle} onClick={handleConfirm}/>
        </div>
        <span className={styles.footerText}>글쓴이 {writer} {writtenDate}</span>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "0.5vh",
  marginTop: 0,
  fontSize: "1.3vh",
};

export default Post;
