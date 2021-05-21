import React, { useEffect, useState, useContext } from "react";

import { useHistory } from "react-router-dom";

import { ReducerContext, actionCreators } from "../features/rootSlice";
import removeCookie from "../utils/removeCookie";
import { ID_TOKEN_KEY, DEFAULT_ERROR_MESSAGE } from "../constants/constants";

import styles from "./styles/Menu.module.css";
import Container from "./shared/Container";
import ModalHeader from "./shared/ModalHeader";
import HeaderBoard from "./shared/HeaderBoard";
import PopUpWindow from "./shared/PopUpWindow";
import CloseButton from "./shared/CloseButton";

const Menu = () => {
  const { dispatch } = useContext(ReducerContext);
  const [shouldLogOut, setShouldLogOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (!shouldLogOut) {
      return;
    }

    if (removeCookie(ID_TOKEN_KEY)) {
      dispatch(actionCreators.userDeleted());
      history.replace("/");
    } else {
      setErrorMessage(DEFAULT_ERROR_MESSAGE);
      setShouldLogOut(false);
    }
  }, [shouldLogOut, dispatch, history]);

  const handleLogOut = () => {
    if (shouldLogOut) {
      return;
    }

    setShouldLogOut(true);
  };
  const handlePopUpClose = () => {
    setErrorMessage("");
  };
  const handleModalClose = () => {
    history.push("/");
  };

  return (
    <Container className={styles.Container}>
      <CloseButton className={styles.closeButton} onClick={handleModalClose} />
      {errorMessage
        ? <PopUpWindow className={styles.popUp} text={errorMessage} onClick={handlePopUpClose}/>
        : null
      }
      <ModalHeader text="메뉴" />
      <HeaderBoard
        boardClassName={styles.board}
        barClassName={styles.bar}
        onClick={handleLogOut}
      >
        로그아웃
      </HeaderBoard>
    </Container>
  );
};

export default Menu;
