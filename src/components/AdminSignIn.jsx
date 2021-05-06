import React from "react";

import dogsHangingBackImg from "../assets/images/dogs-hanging-back.png";

import styles from "./styles/AdminSignIn.module.css";
import Home from "./shared/Home.jsx";
import Input from "./shared/Input.jsx";
import InputButton from "./shared/InputButton.jsx";

const AdminSignIn = () => {
  return (
    <Home>
      <img className={styles.mainImage} src={dogsHangingBackImg} alt="" />
      <form className={styles.form}>
        <Input title={"ID"}/>
        <Input title={"Password"}/>
        <div className={styles.buttonsContainer}>
          <InputButton text={"sign up"} style={styles.inputButton} />
          <InputButton text={"sign in"} style={styles.inputButton} />
        </div>
      </form>
    </Home>
  );
};

export default AdminSignIn;