import React from "react";

import concatClassNames from "../../../utils/concatClassNames";
import styles from "./styles.module.css";

const Button = ({ className = "", text = "", type = "submit", ...rest }) => {
  return (
    <input
      className={concatClassNames(styles.inputButton, className)}
      type={type}
      value={text}
      {...rest}
    />
  );
};

export default Button;
