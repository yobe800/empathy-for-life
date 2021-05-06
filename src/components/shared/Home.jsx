import React from "react";

import styles from "../styles/Home.module.css";

const Home = ({ children }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>생명공감</h1>
      {children}
    </div>
  );
};

export default Home;
