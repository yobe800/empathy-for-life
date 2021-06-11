import React from "react";

import styles from "../styles/PopUpWindow.module.css";

import CloseButton from "./CloseButton/";

const PopUpWindow = ({ className, text, onClick, children }) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <CloseButton className={styles.button} onClick={onClick} />
      <span className={styles.content}>{text}</span>
      {children}
    </div>
  );
};

export default PopUpWindow;
