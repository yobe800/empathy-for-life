import React from "react";

import concatClassNames from "../../../utils/concatClassNames";
import styles from "./styles.module.css";

const ModalContainer = ({ className, children }) => {
  return (
      <div className={concatClassNames(styles.container, className)}>
        {children}
      </div>
  );
};

export default ModalContainer;
