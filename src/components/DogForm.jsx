import React from "react";

import styles from "./styles/DogForm.module.css";
import Container from "./shared/Container";
import Input from "./shared/Input";
import InputButton from "./shared/InputButton";
import ModalHeader from "./shared/ModalHeader";

const DogForm = () => {
  return (
    <Container>
      <ModalHeader text="강아지 추가">
        <div className={styles.inputButtonsContainer}>
          <InputButton text="추가" form="dogForm" />
          <InputButton text="취소" form="dogForm" type="button" />
        </div>
      </ModalHeader>
      <form id="dogForm" className={styles.form}>
        <Input title="이름" headingAttr={headingAttribute} inputAttr={inputAttribute} />
        <div className={styles.selectContainer}>
          <label className={styles.selectLabel} for="gender">
            성별
          </label>
          <select className={styles.select} id="gender" name="gender">
            <option value="male">수컷</option>
            <option value="female">암컷</option>
          </select>
        </div>
        <Input title="견종" headingAttr={headingAttribute} inputAttr={inputAttribute} />
        <Input title="나이" headingAttr={headingAttribute} inputAttr={numberInputAttribute} />
        <Input title="무게(Kg)" headingAttr={headingAttribute} inputAttr={numberInputAttribute} />
        <div className={styles.checkboxesContainer}>
          <Input title="심장사상충" headingAttr={headingAttribute} inputAttr={checkboxInputAttribute} />
          <Input title="중성화" headingAttr={headingAttribute} inputAttr={checkboxInputAttribute}/>
        </div>
        <Input title="입양일" headingAttr={headingAttribute} inputAttr={dateInputAttribute} />
        <div className={styles.selectContainer}>
          <label className={styles.selectLabel} for="adoptionStatus">입양 상태</label>
          <select className={styles.select} id="adoptionStatus">
            <option value="ready">
              준비
            </option>
            <option value="progress">
              진행
            </option>
            <option value="completed">
              완료
            </option>
          </select>
        </div>
        <Input title="사진" headingAttr={headingAttribute} inputAttr={fileInputAttribute} />
        <div className={styles.selectContainer}>
          <label className={styles.selectLabel} for="dogCharacter">캐릭터</label>
          <select className={styles.select} id="dogCharacter">
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
          <label className={styles.textareaLabel} for="description">설명</label>
          <textarea id="description" className={styles.textarea} placeholder="창을 아래로 늘릴 수 있어요. :)"></textarea>
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
