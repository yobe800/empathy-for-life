import React from "react";
import styles from "../styles/PopUpWindow.module.css";

const PopUpWindow = ({ text, onClick }) => {
  return (
    <div className={styles.popUpContainer}>
      <button
        className={styles.closeButton}
        onClick={onClick}
      >
        X
      </button>
    <span className={styles.content}>{text}</span>
    </div>
  );
};

export default PopUpWindow;
