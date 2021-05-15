import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import throttle from "lodash.throttle";

import { DEFAULT_ERROR_MESSAGE } from "../constants/constants";

import styles from "./styles/DogsInformation.module.css";
import Container from "./shared/Container";
import ModalHeader from "./shared/ModalHeader";
import InputButton from "./shared/InputButton";
import Input from "./shared/Input";
import DogInformationCard from "./shared/DogInformationCard";
import CloseButton from "./shared/CloseButton";
import PopUpWindow from "./shared/PopUpWindow";

const DogsInformation = () => {
  const [nextPage, setNextPage] = useState(0);
  const [search, setSeartch] = useState("");
  const [dogInformations, setDogInformations] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const { modal } = history.location.state;

  useEffect(() => {
    let controller;
    const timeId = setTimeout(async () => {
      controller = new AbortController();
      const { signal } = controller;

      try {
        const serverUrl = process.env.REACT_APP_SERVER_URL;
        const response = await fetch(
          `${serverUrl}/dog?search=${search}`,
          { signal },
        );
        const {
          message,
          result: { dogs, next }
        } = await response.json();
        if (message === "ok") {
          const filteredDogs = dogs.map(({ _id, name, breed, gender, age, character }) => ({
            id: _id,
            name,
            breed,
            gender,
            age,
            character,
          }));
          setDogInformations(filteredDogs);
          setNextPage(next);
        } else {
          setErrorMessage(message);
        }
      } catch (error) {
        setErrorMessage(DEFAULT_ERROR_MESSAGE);
      }
    }, 300);
    return () => {
      clearTimeout(timeId);
      controller?.abort();
    }
  }, [search]);

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }

    setShouldFetch(false);
    const controller = new AbortController();
    const { signal } = controller;

    const fetchNextDogInformations = async () => {
      try {
        const serverUrl = process.env.REACT_APP_SERVER_URL;
        const response = await fetch(
          `${serverUrl}/dog?search=${search}&next=${nextPage}`,
          { signal },
        );

        const { message, result: { dogs, next } } = await response.json();

        if (message === "ok") {
          const filteredDogs = dogs.map(({ _id, name, breed, gender, age, character }) => ({
            id: _id,
            name,
            breed,
            gender,
            age,
            character,
          }));
          setDogInformations((lastDogInfos) => lastDogInfos.concat(filteredDogs));
          setNextPage(next);
        } else {
          setErrorMessage(message);
        }
      } catch (error) {
        setErrorMessage(DEFAULT_ERROR_MESSAGE);
      }
    };

    fetchNextDogInformations();
  }, [shouldFetch, nextPage, search]);

  const handleModalClose = () => {
    history.push("/");
  };
  const handleSearchInput = (event) => {
    setSeartch(event.target.value);
  };
  const handleClosePopUp = () => {
    setErrorMessage("");
  };
  const handleNextDogInfoFetch = throttle((event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    const scrollBottomPostion = scrollTop + clientHeight;
    const isNearBottom = scrollHeight <= scrollBottomPostion + 1;

    if (isNearBottom) {
     setShouldFetch(true);
    }
  }, 500);

  const dogInformationList = dogInformations.map((dogInfo) => (
    <DogInformationCard key={dogInfo.id} {...dogInfo} />
  ));

  return (
    <Container>
      {errorMessage
        ? <div className={styles.popUpContainer}>
            <PopUpWindow
              text={errorMessage}
              onClick={handleClosePopUp}
            />
          </div>
        : null
      }
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
          <Input
            inputAttr={{
              ...inputAttribute,
              value: search,
              onInput: handleSearchInput,
            }}
          />
        </div>
      </ModalHeader>
      <div
        className={styles.cardContainer}
        onScroll={handleNextDogInfoFetch}
      >
        {dogInformationList}
      </div>
    </Container>
  );
};

const inputStyle = { fontSize: "1.5vh" };
const inputAttribute = { style: inputStyle, placeholder: "검색" };

export default DogsInformation;
