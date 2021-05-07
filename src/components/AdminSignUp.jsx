import React from "react";

import dogsHangingBackImg from "../assets/images/dogs-hanging-back.png";

import styles from "./styles/AdminSignUp.module.css";
import Home from "./shared/Home.jsx";
import Input from "./shared/Input.jsx";
import InputButton from "./shared/InputButton.jsx";

const AdminSignUp = () => {
  return (
    <Home imageSrc={dogsHangingBackImg}>
      <form className={styles.form}>
        {inputs}
        <div className={styles.buttonsContainer}>
          <InputButton text={"sign up"} />
        </div>
      </form>
    </Home>
  );
};

const inputStyle = { height: "1vw" };
const inputs = ["ID", "Password", "Confirm Password", "User name", "Email"]
  .map((title, index) => {
    const inputType = title.includes("Password") ? "password" : "text";

    return (
      <Input
        key={index}
        type={inputType}
        title={title}
        style={inputStyle}
      />
    );
  });

export default AdminSignUp;
