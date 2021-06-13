import React from "react";

import concatClassNames from "../../../utils/concatClassNames";

import styles from "./styles.module.css";
import CloseButton from "../CloseButton/";

const PopUp = ({ className = "", text = "", onClick, children }) => {
  return (
    <div className={concatClassNames(styles.container, className)}>
      <CloseButton className={styles.button} onClick={onClick} />
      <span className={styles.content}>{text}</span>
      {children}
    </div>
  );
};

export default PopUp;
