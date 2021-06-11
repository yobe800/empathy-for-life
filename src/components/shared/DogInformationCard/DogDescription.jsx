import React from "react";
import styles from "./styles.module.css";

const DogDescription = ({ name, breed, gender, age }) => {
  return (
    <ul className={styles.descriptions}>
      <li>이름: {name}</li>
      <li>견종: {breed}</li>
      <li>성별: {gender}</li>
      <li>나이: {`${age}살`}</li>
    </ul>
  );
};

export default DogDescription;
