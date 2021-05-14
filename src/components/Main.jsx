import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { IMAGE_URLS, CHATS } from "../constants/constants";

import socket from "../socket/socket";
import useCanvasDraw from "../hooks/useCanvasDraw";

import styles from "./styles/Main.module.css";
import InputButton from "./shared/InputButton";
import Input from "./shared/Input";
import HeaderBoard from "./shared/HeaderBoard";

const Main = ({ userName }) => {

  useEffect(() => {
    socket.auth = { userName };
    socket.connect();
  }, [userName]);

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
  const [chatDatum, setChatDatum] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [shouldSendMessage, setShouldSendMessage] = useState(false);
  const chatContainerRef = useRef();

  useEffect(() => {
    if (!shouldSendMessage) {
      return;
    }

    socket.emit("chat", chatMessage);
    setShouldSendMessage(false);
    setChatMessage("");
  }, [chatMessage, shouldSendMessage, setShouldSendMessage]);

  useEffect(() => {
    socket.on(
      "connected user",
      ({ name: userName, createdAt }) => {
        const chatData = {
          type: CHATS.CONNECTED_USER,
          userName,
          createdAt,
        };
        setChatDatum(
          (lastChatContents) => [...lastChatContents, chatData],
        );
      },
    );
    socket.on(
      "disconnected user",
      ({ name: userName, disconnectedAt }) => {
        const chatData = {
          type: CHATS.DISCONNECTED_USER,
          userName,
          createdAt: disconnectedAt,
        };
        setChatDatum((lastChatContents) => [...lastChatContents, chatData]);
      },
    );
    socket.on(
      "chat",
      ({ user, message, createdAt }) => {
        let isSelf = false;

        if (socket.id === user.id) {
          isSelf = true;
        }

        const chatData = {
          type: CHATS.MESSAGE,
          isSelf,
          userName: user.name,
          message,
          createdAt,
        };
        setChatDatum((lastChatContents) => [...lastChatContents, chatData]);
      }
    );
  }, [setChatDatum]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [chatDatum]);

  const chats = chatDatum.map(({ type, userName, isSelf, message, createdAt }) => {
    if (type === CHATS.CONNECTED_USER) {
      return (
        <li className={styles.connection} key={createdAt}>
          <span>{userName}님이 입장하셨습니다.</span>
        </li>
      );
    } else if (type === CHATS.MESSAGE) {
      return (
        <li
          className={isSelf
            ? styles.myMessageContainer
            : styles.otherMessageContainer
          }
          key={createdAt}
        >
          {isSelf ? null : <span className={styles.userName}>{userName}</span>}
          <p
            className={isSelf ? styles.myMessage : styles.otherMessage}
          >
            {message}
          </p>
          <span className={styles.messageDate}>{createdAt}</span>
        </li>
      );
    } else if (type = CHATS.DISCONNECTED_USER) {
      return (
        <li className={styles.connection} key={createdAt}>
          <span>{userName}님이 퇴장하셨습니다.</span>
        </li>
      );
    }
  });

  return (
    <div className={styles.chatContainer}>
      <ol className={styles.chatBorder} ref={chatContainerRef}>
        {chats}
      </ol>
      <InputContainer
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
        setShouldSendMessage={setShouldSendMessage}
      />
    </div>
  );
};

const InputContainer = ({ chatMessage, setChatMessage, setShouldSendMessage }) => {
  const handleInput = (event) => {
    setChatMessage(event.target.value);
  };
  const handleSubmitMessage = (event) => {
    event.preventDefault();
    if (!chatMessage) {
      return;
    }

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
