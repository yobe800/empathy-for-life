import React from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "./styles/DogsInformation.module.css";
import Container from "./shared/Container";
import ModalHeader from "./shared/ModalHeader";
import InputButton from "./shared/InputButton";
import Input from "./shared/Input";
import DogInformationCard from "./shared/DogInformationCard";
import CloseButton from "./shared/CloseButton";

const DogsInformation = () => {
  const history = useHistory();
  const { modal } = history.location.state;

  const handleModalClose = () => {
    history.push("/");
  };

  return (
    <Container>
      <div className={styles.closeButtonContainer}>
        <CloseButton onClick={handleModalClose}/>
      </div>
      <ModalHeader text={"강아지들"}>
        <div className={styles.inputsContainer}>
          <Link to={{
            pathname: "/dogs/new",
            state: { modal },
          }}>
            <InputButton
              type="button"
              text={"추가"}
              style={inputStyle}
            />
          </Link>
          <Input style={{ inputStyle }} placeholder="검색하기" />
        </div>
      </ModalHeader>
      <div className={styles.cardContainer}>
        <DogInformationCard />
      </div>
    </Container>
  );
};

const inputStyle = { fontSize: "1.5vh" };

export default DogsInformation;
