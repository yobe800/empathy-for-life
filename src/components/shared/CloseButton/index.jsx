import React from "react";

import styles from "./styles.module.css";

const CloseButton = ({ className, onClick }) => {
  return (
    <button
      className={`${styles.closeButton} ${className}`}
      onClick={onClick}
    >
      X
    </button>
  );
};

export default CloseButton;
