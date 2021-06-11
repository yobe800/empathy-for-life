import React from "react";
import { Link } from "react-router-dom";

import useModalLocationGet from "../../../hooks/useModalLocationGet";

import styles from "./styles.module.css";
import InputButton from "../InputButton";

const DetailButton = ({ id }) => {
  const { pathname, modal } = useModalLocationGet();

  return (
    <Link
      className={styles.anchor}
      to={{
        pathname: `${pathname}/${id}`,
        state: { modal },
      }}
    >
      <InputButton
        className={styles.button}
        text="세부정보"
      />
    </Link>
  );
};

export default DetailButton;
