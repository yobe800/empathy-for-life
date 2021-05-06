import React from "react";

import homeImage from "../assets/images/home.jpeg";
import googleIcon from "../assets/images/google-icon.png";

import styles from "./styles/Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>생명공감</h1>
      <div className={styles.homeImageContainer}>
        <img className={styles.homeImage} src={homeImage} alt="dogs watching you over the wall" />
      </div>
      <button className={styles.signInButton}>
        <img className={styles.googleIcon} src={googleIcon} width={50} />
        <span className={styles.signText}>Sign In with Google</span>
      </button>
    </div>
  );
};

export default Home;
