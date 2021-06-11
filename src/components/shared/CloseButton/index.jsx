import React from "react";

import concatClassNames from "../../../utils/concatClassNames";
import styles from "./styles.module.css";

const CloseButton = ({ className, onClick }) => {
  return (
    <button
      className={concatClassNames(styles.closeButton, className)}
      onClick={onClick}
    >
      X
    </button>
  );
};

export default CloseButton;
