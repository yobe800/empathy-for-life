import React from "react";
import styles from "../styles/PopUpWindow.module.css";

const PopUpWindow = ({ text, handleClick }) => {
  return (
    <div className={styles.popUpContainer}>
      <button
        className={styles.closeButton}
        onClick={handleClick}
      >
        X
      </button>
    <span className={styles.content}>{text}</span>
    </div>
  );
};

export default PopUpWindow;
