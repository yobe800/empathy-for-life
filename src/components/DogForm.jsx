import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import validator from "validator";

import { LIMIT_FILE_SIZE, DEFAULT_ERROR_MESSAGE } from "../constants/constants";
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
  const [dogForm, setDogForm] = useState(null);
  const [shouldDelete, setShouldDelete] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const { id } = useParams();
  const history = useHistory();
  const { modal } = history.location.state;
  const imgRef = useRef(null);

  useEffect(() => {
    if (!shouldFetch || !dogForm) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const addNewDog = async () => {
      try {
        const { photo } = dogForm;
        const base64 = await getBase64FromImageAsync(photo);
        const copiedDogForm = { ...dogForm, photo: base64 };
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
        setErrorMessage(DEFAULT_ERROR_MESSAGE);
        setDogForm(null);
        setShouldFetch(false);
      }
    };

    const editDog = async () => {
      try {
        const { photo } = dogForm;
        const base64 = await getBase64FromImageAsync(photo);
        const copiedDogForm = { ...dogForm, photo: base64 };

        const response = await fetch(
          `${serverUrl}/dog/${id}`,
          {
            method: "PUT",
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
        setErrorMessage(DEFAULT_ERROR_MESSAGE);
        setDogForm(null);
      }
    };

    if (id) {
      editDog();
    } else {
      addNewDog();
    }

    return () => {
      console.log("헬로");
      controller.abort();
    }
  }, [dogForm, history, id, modal, shouldFetch]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const getDogInformation = async () => {
      try {
        const response = await fetch(
          `${serverUrl}/dog/${id}`,
          { signal },
        );

        const { message, result } = await response.json();
        const {
          name,
          gender,
          breed,
          age,
          weight,
          heart_worm: heartWorm,
          neutering,
          entranced_at,
          adoption_status: adoptionStatus,
          photo,
          character: dogCharacter,
          description,
        } = result;

        if (message === "ok") {
          imgRef.current.src = photo.url;
          const dogInformation = {
            name,
            gender,
            breed,
            age,
            weight,
            heartWorm,
            neutering,
            entrancedAt: entranced_at.split("T")[0],
            adoptionStatus,
            dogCharacter,
            description,
          };

          setDogForm(dogInformation);
        }
      } catch (error) {
        logWarnOrErrInDevelopment(error);
        setErrorMessage(DEFAULT_ERROR_MESSAGE);
        setDogForm(null);
      }
    };

    getDogInformation();
  }, [id]);

  useEffect(() => {
    if (!shouldDelete) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const deleteDogInformation = async () => {
      try {
        const response = await fetch(
          `${serverUrl}/dog/${id}`,
          {
            method: "DELETE",
            signal,
          },
        );

        const { message } = await response.json();

        if (message === "ok") {
          history.push("/dogs", { modal });
        } else {
          setErrorMessage(message);
          setShouldDelete(false);
        }
      } catch (error) {
        logWarnOrErrInDevelopment(error);
        setErrorMessage(DEFAULT_ERROR_MESSAGE);
        setShouldDelete(false);
      }
    };

    deleteDogInformation();

    return () => controller.abort();
  }, [shouldDelete, history, id, modal]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (shouldFetch) {
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
      setShouldFetch(true);
    }
  };
  const handleClosePopUp = () => {
    setErrorMessage("");
    setDeleteMessage("");
  };
  const handleModalClose = () => {
    history.push("/");
  };
  const handleFormCancel = () => {
    history.goBack();
  };
  const handleFileSize = (event) => {
    const fileSize = event.target.files[0]?.size;

    if (!fileSize) {
      return;
    }

    if (LIMIT_FILE_SIZE < fileSize) {
      setErrorMessage("5MB 이상의 파일은 업로드 할 수 없습니다");
      event.target.value = "";
    } else {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        imgRef.current.src = fileReader.result;
      };
      fileReader.readAsDataURL(event.target.files[0]);
    }
  };
  const handleDogDelete = () => {
    setDeleteMessage("");
    setShouldDelete(true);
  };

  const handleDeletionPopUp = () => {
    if (shouldDelete) {
      return;
    }

    setDeleteMessage("정말 삭제하시겠습니까?");
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
      {deleteMessage
        ? <div className={styles.popUpContainer}>
            <PopUpWindow
              text={deleteMessage}
              onClick={handleClosePopUp}
            />
            <InputButton text="확인" type="button" onClick={handleDogDelete} />
          </div>
        : null
      }
      <div className={styles.closeButtonContainer}>
        <CloseButton onClick={handleModalClose} />
      </div>
      <ModalHeader text="강아지 추가">
        <div className={styles.inputButtonsContainer}>
          <InputButton text={id ? "수정" : "추가"} form="dogForm" />
          {id ? <InputButton text="삭제" type="button" onClick={handleDeletionPopUp} /> : null}
          <InputButton text="취소" type="button" onClick={handleFormCancel} />
        </div>
      </ModalHeader>
      <form id="dogForm" className={styles.form} onSubmit={handleSubmit}>
        <Input title="이름" headingAttr={headingAttribute} inputAttr={{ ...inputAttribute, name: "name", defaultValue: dogForm?.name }} />
        <div className={styles.selectContainer}>
          <label className={styles.selectLabel} htmlFor="gender">
            성별
          </label>
          <select className={styles.select} id="gender" name="gender" defaultValue={dogForm?.gender}>
            <option value="male">수컷</option>
            <option value="female">암컷</option>
          </select>
        </div>
        <Input title="견종" headingAttr={headingAttribute} inputAttr={{ ...inputAttribute, name: "breed", defaultValue: dogForm?.breed }} />
        <Input title="나이" headingAttr={headingAttribute} inputAttr={{ ...numberInputAttribute, name: "age", defaultValue: dogForm?.age }} />
        <Input title="무게(Kg)" headingAttr={headingAttribute} inputAttr={{ ...numberInputAttribute, name: "weight", defaultValue: dogForm?.weight }} />
        <div className={styles.checkboxesContainer}>
          <Input title="심장사상충" headingAttr={headingAttribute} inputAttr={{ ...checkboxInputAttribute, name: "heartWorm", defaultValue: dogForm?.heartWorm }} />
          <Input title="중성화" headingAttr={headingAttribute} inputAttr={{ ...checkboxInputAttribute, name: "neutering", defaultValue: dogForm?.neutering }}/>
        </div>
        <Input title="입소일" headingAttr={headingAttribute} inputAttr={{ ...dateInputAttribute, name: "entrancedAt", defaultValue: dogForm?.entrancedAt}} />
        <div className={styles.selectContainer}>
          <label className={styles.selectLabel} htmlFor="adoptionStatus">입양 상태</label>
          <select
            id="adoptionStatus"
            className={styles.select}
            name="adoptionStatus"
            defaultValue={dogForm?.adoptionStatus}
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
          inputAttr={{
            ...fileInputAttribute,
            name: "photo",
            required: id ? false : true,
            onChange: handleFileSize,
          }}
        />
        <img className={styles.thumnail} ref={imgRef} alt="dog profile thumnail"/>
        <div className={styles.selectContainer}>
          <label className={styles.selectLabel} htmlFor="dogCharacter">캐릭터</label>
          <select
            id="dogCharacter"
            className={styles.select}
            name="dogCharacter"
            defaultValue={dogForm?.dogCharacter}
          >
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
            defaultValue={dogForm?.description}
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
