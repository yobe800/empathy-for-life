import React, { useEffect, useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { IMAGE_URLS } from "../constants/constants";

import socket from "../socket/socket";
import useCanvasDraw from "../hooks/useCanvasDraw";

import styles from "./styles/Main.module.css";
import InputButton from "./shared/InputButton";
import Input from "./shared/Input";
import HeaderBoard from "./shared/HeaderBoard";

const ChatContext = React.createContext(null);

const Main = ({ userName }) => {
  const [chatMessage, setChatMessage] = useState("");
  const [shouldSendMessage, setShouldSendMessage] = useState(false);

  useEffect(() => {
    socket.auth = { userName };
    socket.connect();
    socket.on("connected user", (users) => {
    });
    socket.on("chat", (message) => {
      console.log("message");
    });

    return socket.disconnect;
  }, [userName]);

  useEffect(() => {
    if (!shouldSendMessage) {
      return;
    }

    socket.emit("chat", chatMessage);
    setShouldSendMessage(false);
    setChatMessage("");
  }, [shouldSendMessage, setShouldSendMessage]);

  return (
    <ChatContext.Provider value={{
      chatMessage,
      setChatMessage,
      setShouldSendMessage,
    }}>
      <div className={styles.container}>
        <ChatContainer>

        </ChatContainer>
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
    </ChatContext.Provider>
  );
};

const Navigation = () => {
  return (
    <nav className={styles.navigation}>
      {navigations}
    </nav>
  );
};

const ChatContainer = ({ children }) => {
  return (
    <div className={styles.chatContainer}>
      <div className={styles.conversationBorder}>
        {children}
      </div>
      <InputContainer />
    </div>
  );
};

const InputContainer = () => {
  const {
    chatMessage,
    setChatMessage,
    setShouldSendMessage,
  } = useContext(ChatContext);

  const handleInput = (event) => {
    setChatMessage(event.target.value);
  };

  const handleSubmitMessage = (event) => {
    event.preventDefault();
    setShouldSendMessage(true);
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmitMessage}>
      <Input style={inputStyle} inputAttr={{ onInput: handleInput, value: chatMessage }}/>
      <InputButton
        text={"전송"}
        style={inputButtonStyle}
      />
    </form>
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
