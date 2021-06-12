import React from "react";

import concatClassNames from "../../../utils/concatClassNames";

import styles from "./styles.module.css";

const HeaderBoard = ({ boardClassName = "", barClassName = "", children, ...rest }) => {

  return (
    <div
      className={concatClassNames(styles.board, boardClassName)}
      {...rest}
    >
      <div
        className={concatClassNames(styles.bar, barClassName)}
      />
      {children}
    </div>
  );
};

export default HeaderBoard;
