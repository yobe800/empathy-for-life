import React from "react";

import styles from "../styles/HeaderBoard.module.css";

const HeaderBoard = ({children, ...rest}) => {
  const boardWidth = rest.style?.width;

  return (
    <div className={styles.board} {...rest}>
      <div className={styles.bar} style={{width: boardWidth}} />
      {children}
    </div>
  );
};

export default HeaderBoard;
