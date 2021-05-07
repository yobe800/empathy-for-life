import React, { Fragment } from "react";

import dogPhoto from "../assets/images/emily.jpg";
import getDogDescriptions from "../utils/getDogDescriptionLists";

import styles from "./styles/DogProfile.module.css";
import Container from "./shared/Container";

const dogData = {
  _id: "1",
  name: "에밀리",
  gender: "암컷",
  breed: "진도믹스",
  age: 1,
  weight: 10,
  heart_worm: false,
  neutering: true,
  entranced_at: "2020-03-03T00:00:00.000Z",
  adoption_status: "progress",
  character: "dog1",
  description: "작은 진도믹스인 에밀리는 자매인 라떼와 달리 겁이 많고 사람에게 아직 쉽게 오지 않아요.\n처음엔 다른 개들을 조금 무서워서 납작 땅에 엎드렸지만 5월부터 운동장에서 맨날 다른 강아지들과 놀면서 용기가 생겼습니다!",
  created_at: "2021-03-03T00:00:00.000Z",
  updated_at: "2021-03-03T00:00:00.000Z",
};

const DogProfile = () => {
  const dogDescriptionLists = getDogDescriptions(dogData)
    .map(({ title, description }) => (
      <Fragment key={title}>
        <dt className={styles.descriptionTitle}>{title}</dt>
        <dd className={styles.descriptionContent}>{description}</dd>
      </Fragment>
    ));

  return (
    <Container>
      <div className={styles.informationContainer}>
        <img
          className={styles.profilePhoto}
          src={dogPhoto}
          alt="a dog profile photo"
        />
        <dl className={styles.descriptionList}>
          {dogDescriptionLists}
        </dl>
      </div>
      <p className={styles.content}>
        {dogData.description}
      </p>
    </Container>
  );
};

export default DogProfile;
