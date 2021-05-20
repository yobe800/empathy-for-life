import React from "react";

import styles from "../styles/Input.module.css";

const Input = ({
  title = "",
  labelClassName = "",
  inputClassName = "",
  labelAttr = {},
  inputAttr = {},
}) => {
  return (
    <div className={styles.container}>
      {title
        ? <label
            htmlFor={title}
            className={`${styles.title} ${labelClassName}`}
            {...labelAttr}
          >
            {title}
          </label>
        : null
      }
      <input
        id={title}
        className={`${styles.textInput} ${inputClassName}`}
        type="text"
        {...inputAttr}
      />
    </div>
  );
};

export default Input;
