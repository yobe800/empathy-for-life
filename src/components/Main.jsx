import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { IMAGE_URLS } from "../constants/constants";

import useCanvasDraw from "../hooks/useCanvasDraw";

import styles from "./styles/Main.module.css";
import InputButton from "./shared/InputButton";
import Input from "./shared/Input";
import HeaderBoard from "./shared/HeaderBoard";

const Main = () => {
  return (
    <div className={styles.container}>
      <ChatContainer />
      <main className={styles.main}>
        <header className={styles.header}>
          <HeaderBoard style={volunteerTimeBoardStyle}>
            <h1 className={styles.timeBoardHeading}>봉사활동 시간</h1>
            <span className={styles.timeBoardText}>01:03:55</span>
          </HeaderBoard>
          <Navigation />
        </header>
        <Canvas />
        <img
          className={styles.grassGroundImage}
          src={IMAGE_URLS.GRASS_GROUND}
          alt="grass ground"
        />
      </main>
    </div>
  );
};

const Navigation = () => {
  return (
    <nav className={styles.navigation}>
      {navigations}
    </nav>
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
    <canvas className={styles.canvas} ref={canvasRef} width={1080} height={1000}></canvas>
  );
};

const navigations = ["미니게임", "게시글", "강아지들", "메뉴"]
  .map((text, index) => (
    <HeaderBoard key={index}>
      <Link className={styles.anchor} to="">{text}</Link>
    </HeaderBoard>
  ));

const volunteerTimeBoardStyle = { width: "20vh", height: "6vh" };
const inputStyle = { width: "85%" };
const inputButtonStyle = { width: "18%", marginLeft: "5%" };

export default Main;
