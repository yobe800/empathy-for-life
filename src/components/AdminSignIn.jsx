import React, { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";

import {
  DEFAULT_ERROR_MESSAGE,
  IMAGE_URLS,
 } from "../constants/constants";

import { userAdded } from "../features/rootSlice";

import styles from "./styles/AdminSignIn.module.css";
import Home from "./shared/Home";
import Input from "./shared/Input";
import InputButton from "./shared/InputButton";
import PopUpWindow from "./shared/PopUpWindow";
import logWarnOrErrInDevelopment from "../utils/logWarnOrErrInDevelopment";

const AdminSignIn = ({ dispatch, isAdministrator }) => {
  const history = useHistory();
  const [idValue, setIdValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isSigningIn) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const signInAdministrator = async () => {
      try {
        const serverUrl = process.env.REACT_APP_SERVER_URL;
        const body = JSON.stringify({ id: idValue, password: passwordValue });
        const response = await fetch(
          `${serverUrl}/admin/sign-in`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body,
            signal,
          },
        );

        const {
          message,
          result,
        } = await response.json();

        if (message === "ok") {
          const userSession = {
            id: result._id,
            userName: result.user_name,
            isAdministrator: result.is_administrator,
            character: result.character,
            accessTime: result.access_time,
          };

          dispatch(userAdded(userSession));
          return history.replace("/");
        }

        setIsSigningIn(false);

        if (message === "invalid password") {
          setErrorMessage("유효하지 않은 비밀번호입니다.");
        } else if (message === "invalid id") {
          setErrorMessage("유효하지 않은 아이디입니다.");
        } else {
          setErrorMessage(message);
        }
      } catch (err) {
        logWarnOrErrInDevelopment(err);
        setIsSigningIn(false);
        setErrorMessage(DEFAULT_ERROR_MESSAGE);
      }
    };

    signInAdministrator();
    return () => controller.abort();
  }, [isSigningIn, dispatch, history, idValue, passwordValue]);

  const handleClosePopUp = () => {
    setErrorMessage("");
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSigningIn(true);
  };
  const handleClick = () => {
    history.push("/admin/sign-up");
  };

  const idInputAttr = {
    onInput: (event) => setIdValue(event.target.value),
  };
  const passwordInputAttr = {
    onInput: (event) => setPasswordValue(event.target.value),
  };

  if (isAdministrator) {
    return <Redirect to="/" />;
  }

  return (
    <Home imageSrc={IMAGE_URLS.DOGS_HANGING_BACK}>
      {errorMessage
        ? <PopUpWindow text={errorMessage} onClick={handleClosePopUp} />
        : null
      }
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input title={"ID"} inputAttr={idInputAttr} />
        <Input
          title={"Password"}
          type="password"
          inputAttr={passwordInputAttr}
        />
        <div className={styles.buttonsContainer}>
          <InputButton
            type="button"
            text={"sign up"}
            onClick={handleClick}
            disabled={!!isSigningIn}
          />
          <InputButton text={"sign in"} disabled={!!isSigningIn} />
        </div>
      </form>
    </Home>
  );
};

export default AdminSignIn;
