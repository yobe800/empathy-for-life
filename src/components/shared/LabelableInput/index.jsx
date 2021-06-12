import React from "react";

import styles from "./styles.module.css";
import Label from "./Label";
import Input from "./Input";

const LabelableInput = ({ title = "", labelAttr = {}, inputAttr = {} }) => {
  const id = title + Date.now();

  return (
    <div className={styles.container}>
      {title
        ? <Label
            id={id}
            title={title}
            attributes={labelAttr}
          />
        : null
      }
      <Input id={id} attributes={inputAttr} />
    </div>
  );
};

export default LabelableInput;
