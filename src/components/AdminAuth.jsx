import React from "react";

import dogsHangingBackImg from "../assets/images/dogs-hanging-back.png";

import styles from "./styles/AdminAuth.module.css";
import Home from "./shared/Home.jsx";
import InputButton from "./shared/InputButton.jsx";
import Input from "./shared/Input.jsx";

const AdminAuth = () => {
  return (
    <Home>
      <img className={styles.mainImage} src={dogsHangingBackImg} alt="" />
      <span className={styles.guideText}>
        the password for access to administrator
      </span>
      <form className={styles.form}>
        <Input type={"password"} />
        <div className={styles.inputButtonContainer}>
          <InputButton />
        </div>
      </form>
    </Home>
  );
};

export default AdminAuth;
