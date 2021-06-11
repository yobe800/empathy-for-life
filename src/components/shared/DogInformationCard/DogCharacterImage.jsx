import React from "react";
import styles from "./styles.module.css";
import { IMAGE_URLS } from "../../../constants/constants";

const DogCharacterImage = ({ character }) => {
  return (
    <div className={styles.imageBox}>
      <img
        className={styles[character]}
        src={IMAGE_URLS.DOGS_SPRITE}
        alt="A dog character"
      />
    </div>
  );
};

export default DogCharacterImage;
