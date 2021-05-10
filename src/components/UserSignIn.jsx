import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import dogsHangingFrontImg from "../assets/images/dogs-hanging-front.png";
import googleIcon from "../assets/images/google-icon.png";
import logWarnOrErrInDevelopment from "../utils/logWarnOrErrInDevelopment";

import { userAdded } from "../features/rootSlice";

import PopUpWindow from "./shared/PopUpWindow";
import { signInWithGoogle } from "../auth/firebase";
import getAuthHeaderByToken from "../utils/getAuthHeaderByToken"
import styles from "./styles/UserSignIn.module.css";
import Home from "./shared/Home.jsx";


const UserSignIn = ({ dispatch }) => {
  const history = useHistory();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isError, setIsError] = useState(false);
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
        const response = await fetch(`${serverUrl}/user/sign-in`, { method: "POST", headers: authHeader, signal });
        const user = await response.json();

        if (!response.ok || user.error) {
          throw new Error(user.error || response.statusText);
        }

        const userState = {
          id: user._id,
          userName: user.user_name,
          isAdministrator: user.is_administrator,
          character: user.character,
          accessTime:user.access_time,
        };

        dispatch(userAdded(userState));
        return history.replace("/");
      } catch (error) {
        logWarnOrErrInDevelopment(error);
        setIsError(true);
        setIsSigningIn(false);
      }
    };

    signInUser();

    return () => controller.abort();
  }, [isSigningIn, dispatch, history]);

  const handleSignIn = () => {
    setIsSigningIn(true);
  };

  const handleClosePopUp = () => {
    setIsError(false);
  };

  return (
    <Home imageSrc={dogsHangingFrontImg}>
      {isError
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
