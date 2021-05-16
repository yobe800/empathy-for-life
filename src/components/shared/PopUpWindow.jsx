import React from "react";
import styles from "../styles/PopUpWindow.module.css";
import CloseButton from "../shared/CloseButton";

const PopUpWindow = ({ text, onClick }) => {
  return (
    <div className={styles.popUpContainer}>
      <div className={styles.buttonContainer}>
        <CloseButton onClick={onClick} />
      </div>
    <span className={styles.content}>{text}</span>
    </div>
  );
};

export default PopUpWindow;
