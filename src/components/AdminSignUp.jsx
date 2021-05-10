import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import validator from "validator";

import dogsHangingBackImg from "../assets/images/dogs-hanging-back.png";

import { userAdded } from "../features/rootSlice";

import styles from "./styles/AdminSignUp.module.css";
import Home from "./shared/Home.jsx";
import Input from "./shared/Input.jsx";
import InputButton from "./shared/InputButton.jsx";
import PopUpWindow from "./shared/PopUpWindow";

const AdminSignUp = ({ dispatch }) => {
  const history = useHistory();
  const [signUpForm, setSignUpForm] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    if (!signUpForm) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const signUpAdmin = async () => {
      try {
        const serverUrl = process.env.REACT_APP_SERVER_URL;
        const body = JSON.stringify({
          id: signUpForm.id,
          password: signUpForm.password,
          userName: signUpForm.userName,
          email: signUpForm.email,
        });
        const response = await fetch(
          `${serverUrl}/admin/sign-up`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            signal,
          },
        );

        const result = await response.json();

        if (result.message) {
          setErrorMessage(result.message);

          return setSignUpForm(null);
        }

        const user = {
          id: result.admin_id,
          userName: result.user_name,
          isAdministrator: result.is_administrator,
          character: result.character,
          accessTime: result.access_time,
        };

        dispatch(userAdded(user));
        history.replace("/");
      } catch (error) {
        setErrorMessage("잠시 후 다시 시도해 주세요");

        return setSignUpForm(null);
      }
    };

    signUpAdmin();

    return () => controller.abort();
  }, [signUpForm]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target.form);
    const signUpForm = {
      id: formData.get("ID").toLowerCase(),
      password: formData.get("Password"),
      confirmPassword: formData.get("Confirm Password"),
      userName: formData.get("User name"),
      email: formData.get("Email"),
    };
    let message = "";

    if (!validator.isAlphanumeric(signUpForm.id)) {
      message += "ID는 대소문자 알파벳과 숫자 조합만 가능합니다.\n";
    }

    if (validator.isEmpty(signUpForm.password)) {
      message += "Password를 입력해주세요.\n"
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      message += "Password와 Confirm password가 일치하지 않습니다.\n";
    }

    if (validator.isEmpty(signUpForm.userName)) {
      message += "User name을 입력해주세요.\n";
    }

    if (!validator.isEmail(signUpForm.email)) {
      message += "유효한 Email을 입력해주세요.\n";
    }

    if (message) {
      setErrorMessage(message);
    } else {
      setSignUpForm(signUpForm);
    }
  };

  const handleClosePopUp = () => {
    setErrorMessage("");
  };

  return (
    <Home imageSrc={dogsHangingBackImg}>
      {errorMessage
        ? <PopUpWindow text={errorMessage} handleClick={handleClosePopUp}/>
        : null
      }
      <form className={styles.form} ref={formRef}>
        {inputs}
        <div className={styles.buttonsContainer}>
          <InputButton text={"sign up"} onClick={handleSubmit} disabled={!!signUpForm}/>
        </div>
      </form>
    </Home>
  );
};

const inputAttribute = {
  style: { marginTop: "1vh" },
  required: true,
};

const inputs = ["ID", "Password", "Confirm Password", "User name", "Email"]
  .map((title, index) => {
    const inputType = title.includes("Password")
      ? "password"
      : "text";

    return (
      <Input
        key={index}
        type={inputType}
        title={title}
        inputAttr={{...inputAttribute, name: title}}
      />
    );
  });


export default AdminSignUp;
