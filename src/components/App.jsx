import React from "react";
import "./styles/reset.css";
import "./styles/font.css";

import UserSignIn from "./UserSignIn";
import AdminAuth from "./AdminAuth";
import AdminSignIn from "./AdminSignIn";
import AdminSignUp from "./AdminSignUp";
import Main from "./Main";
import Modal from "./Modal";
import DogProfile from "./DogProfile";

const App = () => {
  return (
    <>
      <Modal>
        <DogProfile />
      </Modal>
      <Main />
    </>
  );
}

export default App;
