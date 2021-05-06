import React from "react";

import styles from "../styles/InputButton.module.css";

const InputButton = ({ text, style, ...rest }) => {
  return (
    <input className={style ? style : styles.inputButton} type="submit" value={text} {...rest} />
  );
};

export default InputButton;
