import React from "react";

import concatClassNames from "../../../utils/concatClassNames";

import styles from "./styles.module.css";

const Label = ({ id = "", title = "", attributes = {} }) => {
  const className = attributes.className || "";

  return (
  <label
    htmlFor={id}
    {...attributes}
    className={concatClassNames(styles.title, className)}
  >
    {title}
  </label>
  );
};

export default Label;
