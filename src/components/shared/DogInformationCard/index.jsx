import React from "react";

import styles from "./styles.module.css";
import DogCharacterImage from "./DogCharacterImage";
import DogDescription from "./DogDescription";
import EditButton from "./EditButton";
import DetailButton from "./DetailButton";

const DogInformationCard = ({
  id,
  name,
  breed,
  gender,
  age,
  character,
  isAdmin,
}) => {
  const genderTranslatedToKorean = gender === "male"
    ? "수컷" : "암컷";

  return (
    <div className={styles.container}>
      <DogCharacterImage character={character} />
      <DogDescription
        name={name}
        breed={breed}
        gender={genderTranslatedToKorean}
        age={age}
      />
      <div className={styles.buttonContainer}>
        {isAdmin ? <EditButton id={id} /> : null}
        <DetailButton id={id} />
      </div>
    </div>
  );
};

export default DogInformationCard;
