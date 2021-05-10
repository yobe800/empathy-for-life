import React from "react";

import styles from "../styles/Post.module.css";
import InputButton from "./InputButton";

const Post = ({ imageSrc, content, writer, writtenDate }) => {
  return (
    <div className={styles.container}>
      <img className={styles.photo} src={imageSrc} alt="post" />
      <p className={styles.content}>{content}</p>
      <div className={styles.footer}>
        <div className={styles.buttons}>
          <InputButton text="편집" style={buttonStyle} />
          <InputButton text="삭제" style={buttonStyle} />
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
