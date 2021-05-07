import React from "react";

import styles from "../styles/Modal.module.css";

const Modal = ({ children }) => {
  return (
    <div className={styles.modalConatiner}>
      {children}
    </div>
  );
};

export default Modal;
