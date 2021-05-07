import React, { useRef } from "react";
import grassGroundImage from "../assets/images/grass-ground.png";

import useCanvasDraw from "../hooks/useCanvasDraw";

import styles from "./styles/Main.module.css";
import InputButton from "./shared/InputButton";
import Input from "./shared/Input";

const Main = () => {
  return (
    <div className={styles.container}>
      <ChatContainer />
      <div className={styles.canvasContainer}>
        <Canvas />
        <img className={styles.grassGroundImage} src={grassGroundImage} alt="" />
      </div>
    </div>
  );
};

const ChatContainer = () => {
  return (
    <div className={styles.chatContainer}>
      <div className={styles.conversationBorder} />
      <InputContainer />
    </div>
  );
};

const InputContainer = () => {
  return (
    <div className={styles.inputContainer}>
      <Input style={inputStyle} />
      <InputButton text={"전송"} style={inputButtonStyle} />
    </div>
  );
};

const Canvas = () => {
  const canvasRef = useRef(null);
  useCanvasDraw(canvasRef);

  return (
    <canvas className={styles.canvas} ref={canvasRef}></canvas>
  );
};

const inputStyle = { width: "85%" };
const inputButtonStyle = { width: "18%", marginLeft: "5%" };

export default Main;
