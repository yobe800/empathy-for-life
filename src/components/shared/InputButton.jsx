import React from "react";

import styles from "../styles/InputButton.module.css";

const InputButton = ({ text, ...rest }) => {
  return (
    <input
      className={styles.inputButton}
      type="submit"
      value={text}
      {...rest}
    />
  );
};

export default InputButton;
