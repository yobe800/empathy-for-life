import React from "react";

import concatClassNames from "../../../utils/concatClassNames";

import styles from "./styles.module.css";

const Input = ({ id = "", attributes = {} }) => {
  const className = attributes.className || "";

  return (
    <input
      id={id}
      type="text"
      {...attributes}
      className={concatClassNames(styles.textInput, className)}
    />
  );
};

export default Input;
