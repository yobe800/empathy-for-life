import React from "react";

import styles from "../styles/HeaderBoard.module.css";

const HeaderBoard = ({ boardClassName = "", barClassName = "", children, ...rest }) => {
  const boardWidth = rest.style?.width;

  return (
    <div
      className={`${styles.board} ${boardClassName}`}
      {...rest}
    >
      <div
        className={`${styles.bar} ${barClassName}`}
        style={{width: boardWidth}}
      />
      {children}
    </div>
  );
};

export default HeaderBoard;
