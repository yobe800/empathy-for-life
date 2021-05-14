import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import validator from "validator";

import getBase64FromImageAsync from "../utils/getBase64FromImageAsync";
import logWarnOrErrInDevelopment from "../utils/logWarnOrErrInDevelopment";
import styles from "./styles/DogForm.module.css";
import Container from "./shared/Container";
import Input from "./shared/Input";
import InputButton from "./shared/InputButton";
import ModalHeader from "./shared/ModalHeader";
import PopUpWindow from "./shared/PopUpWindow";
import CloseButton from "./shared/CloseButton";

const DogForm = () => {
  const history = useHistory();
  const { modal } = history.location.state;
  const [dogForm, setDogForm] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!dogForm) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const addNewDog = async () => {
      try {
        const { photo } = dogForm;
        const base64 = await getBase64FromImageAsync(photo);
        const copiedDogForm = { ...dogForm, photo: base64 };
        const serverUrl = process.env.REACT_APP_SERVER_URL;
        const response = await fetch(
          `${serverUrl}/dog/new`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(copiedDogForm),
            signal,
          },
        );

        const { message } = await response.json();

        if (message === "ok") {
          history.push("/dogs", { modal });
        }
      } catch (error) {
        logWarnOrErrInDevelopment(error);
        setErrorMessage("잠시 후 다시 시도해 주세요");
        setDogForm(null);
      }
    };

    addNewDog();

    return () => controller.abort();
  }, [dogForm]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (dogForm) {
      return;
    }

    const formData = new FormData(event.target);
    const dogInformation = {
      name: formData.get("name").trim(),
      gender: formData.get("gender"),
      breed: formData.get("breed").trim(),
      age: Number(formData.get("age")),
      weight: Number(formData.get("weight")),
      heartWorm: !!formData.get("heartWorm"),
      neutering: !!formData.get("neutering"),
      entrancedAt: new Date(formData.get("entrancedAt")).toISOString(),
      adoptionStatus: formData.get("adoptionStatus"),
      photo: formData.get("photo"),
      dogCharacter: formData.get("dogCharacter"),
      description: formData.get("description"),
    };

    let message = "";

    if (validator.isEmpty(dogInformation.name)) {
      message += "이름을 입력해 주세요\n";
    }

    if (validator.isEmpty(dogInformation.breed)) {
      message += "견종을 입력해 주세요\n";
    }

    if (message) {
      setErrorMessage(message);
    } else {
      setDogForm(dogInformation);
    }
  };
  const handleClosePopUp = () => {
    setErrorMessage("");
  };

  const handleModalClose = () => {
    history.push("/");
  };

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
      <ModalHeader text="강아지 추가">
        <div className={styles.inputButtonsContainer}>
          <InputButton text="추가" form="dogForm" />
          <InputButton text="취소" form="dogForm" type="button" />
        </div>
      </ModalHeader>
      <form id="dogForm" className={styles.form} onSubmit={handleSubmit}>
        <Input title="이름" headingAttr={headingAttribute} inputAttr={{ ...inputAttribute, name: "name" }} />
        <div className={styles.selectContainer}>
          <label className={styles.selectLabel} htmlFor="gender">
            성별
          </label>
          <select className={styles.select} id="gender" name="gender">
            <option value="male">수컷</option>
            <option value="female">암컷</option>
          </select>
        </div>
        <Input title="견종" headingAttr={headingAttribute} inputAttr={{ ...inputAttribute, name: "breed" }} />
        <Input title="나이" headingAttr={headingAttribute} inputAttr={{ ...numberInputAttribute, name: "age" }} />
        <Input title="무게(Kg)" headingAttr={headingAttribute} inputAttr={{ ...numberInputAttribute, name: "weight" }} />
        <div className={styles.checkboxesContainer}>
          <Input title="심장사상충" headingAttr={headingAttribute} inputAttr={{ ...checkboxInputAttribute, name: "heartWorm" }} />
          <Input title="중성화" headingAttr={headingAttribute} inputAttr={{ ...checkboxInputAttribute, name: "neutering" }}/>
        </div>
        <Input title="입소일" headingAttr={headingAttribute} inputAttr={{ ...dateInputAttribute, name: "entrancedAt"}} />
        <div className={styles.selectContainer}>
          <label className={styles.selectLabel} htmlFor="adoptionStatus">입양 상태</label>
          <select
            id="adoptionStatus"
            className={styles.select}
            name="adoptionStatus"
          >
            <option value="ready">
              준비 중
            </option>
            <option value="wait">
              기다리는 중
            </option>
            <option value="completed">
              완료
            </option>
          </select>
        </div>
        <Input
          title="사진"
          headingAttr={headingAttribute}
          inputAttr={{ ...fileInputAttribute, name: "photo", required: true }}
        />
        <div className={styles.selectContainer}>
          <label className={styles.selectLabel} htmlFor="dogCharacter">캐릭터</label>
          <select className={styles.select} id="dogCharacter" name="dogCharacter">
            <option value="brownShiba">
              갈색 시바견
            </option>
            <option value="darkShiba">
              검정 시바견
            </option>
            <option value="grayShiba">
              회색 시바견
            </option>
          </select>
        </div>
        <div className={styles.textareaContainer}>
          <label className={styles.textareaLabel} htmlFor="description">설명</label>
          <textarea
            id="description"
            className={styles.textarea}
            name="description"
            placeholder="창을 아래로 늘릴 수 있어요. :)"
          />
        </div>
      </form>
    </Container>
  );
};

const fontSize = "1.7vh";

const headingAttribute = {
  style: { fontSize: fontSize },
};

const inputAttribute = {
  style: {
    width: "16vh",
    marginTop: "0.3vh",
  },
  required: true,
};

const numberInputAttribute = {
  style: inputAttribute.style,
  type: "number",
  min: 0,
  max: 99,
  required: true,
};

const dateInputAttribute = {
  ...inputAttribute,
  type: "date",
  style: {
    width: "16vh",
    padding: "0.5vh 0",
    fontSize: fontSize,
    marginRight: "2vw",
  },
  required: true,
};

const checkboxInputAttribute = {
  type: "checkbox",
};

const fileInputAttribute = {
  type: "file",
  accept: "image/png, image/jpeg, image/jpg",
  style: {
    width: "16vh",
    padding: "0.5vh 0",
    marginRight: "2.3vw",
    border: "none",
  },
};

export default DogForm;
