import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import logWarnOrErrInDevelopment from "../utils/logWarnOrErrInDevelopment";
import {
  DEFAULT_ERROR_MESSAGE,
  IMAGE_URLS,
} from "../constants/constants";
import { actionCreators, ReducerContext } from "../features/rootSlice";

import styles from "./styles/AdminAuth.module.css";
import Home from "./shared/Home/";
import Button from "./shared/Button/";
import LabelableInput from "./shared/LabelableInput/";
import PopUp from "./shared/PopUp/";

const AdminAuth = () => {
  const [password, setPassword] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { dispatch } = useContext(ReducerContext);
  const { adminAuthPassed } = actionCreators;
  const history = useHistory();

  useEffect(() => {
    if (!isDetecting || !password) {
      setIsDetecting(false);
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
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body,
            signal,
          },
        );

        const { message } = await response.json();

        if (message === "ok") {
          dispatch(adminAuthPassed());
          return history.replace("/admin/sign-in");
        }

        setIsDetecting(false);

        if (message === "invalid password") {
          setErrorMessage("유효하지 않은 비밀번호입니다.");
        } else {
          setErrorMessage(message);
        }
      } catch (err) {
        logWarnOrErrInDevelopment(err);
        setIsDetecting(false);
        setErrorMessage(DEFAULT_ERROR_MESSAGE);
      }
    };

    detectAuthPassword();

    return () => controller.abort();
  }, [isDetecting, password, dispatch, history, adminAuthPassed]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsDetecting(true);
  };

  const handleInput = (event) => {
    setPassword(event.target.value);
  };

  const handleClosePopUp = () => {
    setErrorMessage("");
  };

  return (
    <Home imageSrc={IMAGE_URLS.DOGS_HANGING_BACK}>
      {errorMessage
        ? (
            <PopUp
              text={errorMessage}
              onClick={handleClosePopUp}
            />
          )
        : null
      }
      <span className={styles.guideText}>
        the password for access to administrator
      </span>
      <form className={styles.form} onSubmit={handleSubmit}>
        <LabelableInput
          inputAttr={{
            type: "password",
            value: password,
            onInput: handleInput,
          }}
        />
        <Button
          className={styles.button}
          text="확인"
          disabled={!!isDetecting}
        />
      </form>
    </Home>
  );
};

export default AdminAuth;
