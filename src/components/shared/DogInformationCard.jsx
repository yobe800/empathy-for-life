import React from "react";

import { IMAGE_URLS } from "../../constants/constants";

import styles from "../styles/dogsInformationCard.module.css";
import InputButton from "./InputButton";

const DogInformationCard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageBox}>
        <img
          className={styles[dogData.character]}
          src={IMAGE_URLS.DOGS_SPRITE}
          alt="A dog character"
        />
      </div>
      <ul className={styles.descriptions}>
        <li>
          이름: {dogData.name}
        </li>
        <li>
          견종: {dogData.breed}
        </li>
        <li>
          성별: {dogData.gender}
        </li>
        <li>
          나이: {dogData.age}
        </li>
      </ul>
      <InputButton text="상세보기" style={{ padding: "1.5% 3%", fontSize: "1.6vh" }}/>
    </div>
  );
};

const dogData = {
  _id: "1",
  name: "에밀리",
  gender: "암컷",
  breed: "진도믹스",
  age: 1,
  entranced_at: "2020-03-03T00:00:00.000Z",
  adoption_status: "progress",
  character: "brownShiba",
};

export default DogInformationCard;
