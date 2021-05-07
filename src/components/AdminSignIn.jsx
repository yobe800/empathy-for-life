import React from "react";

import dogsHangingBackImg from "../assets/images/dogs-hanging-back.png";

import styles from "./styles/AdminSignIn.module.css";
import Home from "./shared/Home.jsx";
import Input from "./shared/Input.jsx";
import InputButton from "./shared/InputButton.jsx";

const AdminSignIn = () => {
  return (
    <Home imageSrc={dogsHangingBackImg}>
      <form className={styles.form}>
        <Input title={"ID"}/>
        <Input title={"Password"}/>
        <div className={styles.buttonsContainer}>
          <InputButton text={"sign up"} style={inputButtonStyle} />
          <InputButton text={"sign in"} style={inputButtonStyle} />
        </div>
      </form>
    </Home>
  );
};

const inputButtonStyle = { width: "6vw" };

export default AdminSignIn;
