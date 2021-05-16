import React from "react";
import { useHistory } from "react-router-dom";

import styles from "./styles/PostForm.module.css";
import Container from "./shared/Container";
import CloseButton from "./shared/CloseButton";
import ModalHeader from "./shared/ModalHeader";
import InputButton from "./shared/InputButton";
import Input from "./shared/Input";

const PostForm = () => {
  const history = useHistory();

  const handleModalClose = () => {
    history.push("/");
  };

  return (
    <Container>
      <div className={styles.CloseButtonContainer}>
        <CloseButton onClick={handleModalClose} />
      </div>
      <ModalHeader text="글쓰기">
        <div className={styles.inputButtonsContainer}>
          <InputButton text="추가" form="dogForm" />
          <InputButton text="취소" form="dogForm" type="button" />
        </div>
      </ModalHeader>
      <form className={styles.form}>
        <label className={styles.selectLabel}>
          선택
          <select className={styles.select}>
            <option>없음</option>
            <option>에밀리</option>
            <option>라떼</option>
            <option>순돌이</option>
          </select>
        </label>
        <Input
          title="사진"
          inputAttr={fileInputAttribute}
        />
        <textarea
          className={styles.textarea}
          placeholder="게시할 내용을 입력해주세요. :)"
        />
      </form>
    </Container>
  );
};

const fileInputAttribute = {
  type: "file",
  accept: "image/png, image/jpeg, image/jpg",
  style: {
    width: "16vh",
    padding: "0.5vh 0",
    border: "none",
  },
};

export default PostForm;
