import React from "react";

import styles from "../styles/Input.module.css";

const Input = ({ title, type = "text", headingAttr, inputAttr }) => {
  return (
    <div className={styles.container}>
      {title
        ? <label for={title} className={styles.title} {...headingAttr}>{title}</label>
        : null
      }
      <input id={title} className={styles.textInput} type={type} {...inputAttr} />
    </div>
  );
};

export default Input;
