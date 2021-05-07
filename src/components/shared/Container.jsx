import React from "react";

import styles from "../styles/Container.module.css";

const Container = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.border}>
        {children}
      </div>
    </div>
  );
};

export default Container;
