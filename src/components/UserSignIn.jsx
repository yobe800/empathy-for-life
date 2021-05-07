import React from "react";

import dogsHangingFrontImg from "../assets/images/dogs-hanging-front.png";
import googleIcon from "../assets/images/google-icon.png";

import styles from "./styles/UserSignIn.module.css";
import Home from "./shared/Home.jsx";

const UserSignIn = () => {
  return (
    <Home imageSrc={dogsHangingFrontImg}>
      <button className={styles.signInButton}>
        <img className={styles.googleIcon} src={googleIcon} />
        <span className={styles.signText}>Sign In with Google</span>
      </button>
    </Home>
  );
};

export default UserSignIn;
