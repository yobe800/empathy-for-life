import React from "react";

import styles from "./styles/DogsInformation.module.css";
import Container from "./shared/Container";
import ModalHeader from "./shared/ModalHeader";
import InputButton from "./shared/InputButton";
import Input from "./shared/Input";
import DogInformationCard from "./shared/DogInformationCard";

const DogsInformation = () => {
  return (
    <Container>
      <ModalHeader text={"강아지들"}>
        <div className={styles.inputsContainer}>
          <InputButton text={"글쓰기"} style={inputStyle} />
          <Input style={{inputStyle}} placeholder="검색하기" />
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
