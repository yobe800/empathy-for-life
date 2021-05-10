import React from "react";
import { useHistory } from "react-router-dom";

import dogsHangingBackImg from "../assets/images/dogs-hanging-back.png";

import styles from "./styles/AdminSignIn.module.css";
import Home from "./shared/Home.jsx";
import Input from "./shared/Input.jsx";
import InputButton from "./shared/InputButton.jsx";

const AdminSignIn = () => {
  const history = useHistory();

  const handleClick = () => {
    history.push("/admin/sign-up");
  };

  return (
    <Home imageSrc={dogsHangingBackImg}>
      <form className={styles.form}>
        <Input title={"ID"}/>
        <Input title={"Password"}/>
        <div className={styles.buttonsContainer}>
          <InputButton
            type="button"
            text={"sign up"}
            onClick={handleClick}
          />
          <InputButton text={"sign in"} />
        </div>
      </form>
    </Home>
  );
};

export default AdminSignIn;
