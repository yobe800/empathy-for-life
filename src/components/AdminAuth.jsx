import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import dogsHangingBackImg from "../assets/images/dogs-hanging-back.png";

import logWarnOrErrInDevelopment from "../utils/logWarnOrErrInDevelopment";

import { adminAuthPassed } from "../features/rootSlice";

import styles from "./styles/AdminAuth.module.css";
import Home from "./shared/Home.jsx";
import InputButton from "./shared/InputButton.jsx";
import Input from "./shared/Input.jsx";
import PopUpWindow from "./shared/PopUpWindow";

const AdminAuth = ({ dispatch }) => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isDetecting || !password) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const detectAuthPassword = async () => {
      try {
        const serverUrl = process.env.REACT_APP_SERVER_URL;
        const body = JSON.stringify({ password });
        const response = await fetch(
          `${serverUrl}/admin/authentication`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            signal,
          },
        );

        const { result } = await response.json();

        if (result) {
          dispatch(adminAuthPassed());
          return history.replace("/admin/sign-in");
        }

        setIsDetecting(false);
        setError("invalid");
      } catch (err) {
        logWarnOrErrInDevelopment(err);
        setIsDetecting(false);
        setError("error");
      }
    };

    detectAuthPassword();

    return () => controller.abort();
  }, [isDetecting, password, dispatch, history]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsDetecting(true);
  };

  const handleInput = (event) => {
    setPassword(event.target.value);
  };

  const handleClosePopUp = () => {
    setError(null);
  };

  const inputAttribute = {
    value: password,
    onInput: handleInput,
  };

  const warningText = error && error === "invalid"
    ? "잘못된 비밀번호입니다"
    : "잠시 후 다시 시도해 주세요";

  return (
    <Home imageSrc={dogsHangingBackImg}>
      {error
        ? (
            <PopUpWindow
              text={warningText}
              onClick={handleClosePopUp}
            />
          )
        : null
      }
      <span className={styles.guideText}>
        the password for access to administrator
      </span>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input type="password" inputAttr={inputAttribute} />
        <div className={styles.inputButtonContainer}>
          <InputButton text="확인" />
        </div>
      </form>
    </Home>
  );
};

export default AdminAuth;
