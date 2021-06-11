import React from "react";

import styles from "./styles.module.css";

const ModalContainer = ({ className, children }) => {
  return (
      <div className={`${styles.container} ${className}`}>
        {children}
      </div>
  );
};

export default ModalContainer;
