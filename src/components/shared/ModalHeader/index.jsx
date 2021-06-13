import React from "react";

import concatClassNames from "../../../utils/concatClassNames";
import styles from "./styles.module.css";

const ModalHeader = ({ className = "", text = "", children }) => {
  return (
    <div className={concatClassNames(styles.container, className)}>
      <h1 className={styles.heading}>{text}</h1>
      {children}
    </div>
  );
};

export default ModalHeader;
