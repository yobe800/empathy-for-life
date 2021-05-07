import React from "react";
import "./styles/reset.css";
import "./styles/font.css";

import UserSignIn from "./UserSignIn";
import AdminAuth from "./AdminAuth";
import AdminSignIn from "./AdminSignIn";
import AdminSignUp from "./AdminSignUp";
import Main from "./Main";
import Modal from "./shared/Modal";

const App = () => {
  return (
    <>
      <Main />
      <Modal />
    </>
  );
}

export default App;
