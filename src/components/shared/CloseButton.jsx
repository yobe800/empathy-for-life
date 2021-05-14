import React from "react";
import styles from "../styles/CloseButton.module.css";

const CloseButton = ({ onClick }) => {
  return (
    <button
      className={styles.closeButton}
      onClick={onClick}
    >
      X
    </button>
  );
};

export default CloseButton;