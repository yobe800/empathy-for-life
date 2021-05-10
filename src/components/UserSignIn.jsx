import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import dogsHangingFrontImg from "../assets/images/dogs-hanging-front.png";
import googleIcon from "../assets/images/google-icon.png";
import logWarnOrErrInDevelopment from "../utils/logWarnOrErrInDevelopment";
import { DEFAULT_ERROR_MESSAGE } from "../constants/constants";

import { userAdded } from "../features/rootSlice";

import PopUpWindow from "./shared/PopUpWindow";
import { signInWithGoogle } from "../auth/firebase";
import getAuthHeaderByToken from "../utils/getAuthHeaderByToken"
import styles from "./styles/UserSignIn.module.css";
import Home from "./shared/Home.jsx";


const UserSignIn = ({ dispatch }) => {
  const history = useHistory();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (!isSigningIn) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const signInUser = async () => {
      try {
        const idToken = await signInWithGoogle();
        const authHeader = getAuthHeaderByToken(idToken);
        const serverUrl = process.env.REACT_APP_SERVER_URL;
        const response = await fetch(
          `${serverUrl}/user/sign-in`,
          {
            method: "POST",
            headers: authHeader,
            credentials: "include",
            signal,
          },
        );

        const { message, result } = await response.json();

        if (message === "ok") {
          const userState = {
            id: result._id,
            userName: result.user_name,
            isAdministrator: result.is_administrator,
            character: result.character,
            accessTime:result.access_time,
          };

          dispatch(userAdded(userState));
          return history.replace("/");
        }

        setIsSigningIn(false);
        setErrorMessage(message);
      } catch (error) {
        logWarnOrErrInDevelopment(error);
        setIsSigningIn(false);
        setErrorMessage(DEFAULT_ERROR_MESSAGE);
      }
    };

    signInUser();

    return () => controller.abort();
  }, [isSigningIn, dispatch, history]);

  const handleSignIn = () => {
    setIsSigningIn(true);
  };
  const handleClosePopUp = () => {
    setErrorMessage("");
  };

  return (
    <Home imageSrc={dogsHangingFrontImg}>
      {errorMessage
        ? (
            <PopUpWindow
              text={`로그인 실패.\n잠시 후 다시 시도해 주세요.`}
              onClick={handleClosePopUp}
            />
          )
        : null
      }
      <button className={styles.signInButton} onClick={handleSignIn}>
        <img className={styles.googleIcon} src={googleIcon} alt="Google Logo" />
        <span className={styles.signText}>Sign In with Google</span>
      </button>
    </Home>
  );
};

export default UserSignIn;
