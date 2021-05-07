import React from "react";

import styles from "../styles/Input.module.css";

const Input = ({ title, type = "text", ...rest }) => {
  return (
    <div className={styles.container}>
      {title ? <h2 className={styles.title}>{title}</h2> : null}
      <input className={styles.textInput} type={type} {...rest} />
    </div>
  );
};

export default Input;
