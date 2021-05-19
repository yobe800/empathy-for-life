import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, useLocation } from "react-router-dom";

import { IMAGE_URLS, CHATS } from "../constants/constants";
import { ReducerContext, selectors } from "../features/rootSlice";
import calculateTime from "../utils/calculateTime";
import socket from "../socket/socket";
import useCanvasDraw from "../hooks/useCanvasDraw";
import useVideoStreaming from "../hooks/useVideoStreaming";

import styles from "./styles/Main.module.css";
import InputButton from "./shared/InputButton";
import Input from "./shared/Input";
import HeaderBoard from "./shared/HeaderBoard";

const Main = () => {
  const { state } = useContext(ReducerContext);
  const [accessTime, setAccessTime] = useState(selectors.getAccessTime(state));
  const userName = selectors.getUserName(state);
  const userId = selectors.getUserId(state);
  const calcuatedAccessTime = calculateTime(accessTime);

  useEffect(() => {
    socket.auth = { userName };
    socket.connect();

    return () => socket.disconnect();
  }, [userName]);

  useEffect(() => {
    const timeId = setInterval(
      () => setAccessTime(accessTime + 1),
      1000,
    );
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const saveUserAccessTime = async () => {
      const body = JSON.stringify({ id: userId, access_time: accessTime });
      await fetch(
        `${serverUrl}/user`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body,
        },
      );
    };
    window.addEventListener("beforeunload", saveUserAccessTime);

    return () => {
      window.removeEventListener("beforeunload", saveUserAccessTime);
      clearInterval(timeId);
    };
  }, [accessTime, userId]);

  return (
    <div className={styles.container}>
      <div className={styles.leftSideContainer}>
        <Video />
        <ChatContainer />
      </div>
      <main className={styles.main}>
        <header className={styles.header}>
          <HeaderBoard style={volunteerTimeBoardStyle}>
            <h1 className={styles.timeBoardHeading}>봉사활동 시간</h1>
            <span className={styles.timeBoardText}>{calcuatedAccessTime}</span>
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
  const location = useLocation();
  const navigations = [
    { en: "posts", ko:"게시글" },
    { en: "dogs", ko: "강아지들" },
    { en: "menu", ko: "메뉴" },
  ]
    .map(({ en, ko }, index) => {
      return (
        <HeaderBoard key={index} style={{ width: "12vh"}}>
          <Link
            className={styles.anchor}
            to={{
              pathname: `/${en}`,
              state: { modal: location },
            }}
          >
            {ko}
          </Link>
        </HeaderBoard>
      );
  });
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

    return () => {
      ["connected user", "disconnected user", "chat"]
        .forEach((eventName) => socket.removeAllListeners(eventName));
    };
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
    } else if (type === CHATS.DISCONNECTED_USER) {
      return (
        <li className={styles.connection} key={createdAt}>
          <span>{userName}님이 퇴장하셨습니다.</span>
        </li>
      );
    }

    return null;
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
    <canvas
      className={styles.canvas}
      ref={canvasRef}
      width={1080}
      height={1000}
    />
  );
};

const Video = () => {
  const { state } = useContext(ReducerContext);
  const isAdministrator = selectors.getIsAdministrator(state);
  const videoRef = useRef(null);
  const videoControllerRef = useRef(null);
  const buttonValue
    = videoControllerRef.current
      && videoControllerRef.current.lastChild.value;
  useVideoStreaming(videoRef, videoControllerRef);

  return (
    <div className={styles.videoContainer}>
      <video
        ref={videoRef}
        className={styles.video}
        muted
        autoPlay
        preload="auto"
        poster="/assets/images/streaming-off.png"
      />
      {isAdministrator
        ? <div ref={videoControllerRef} className={styles.videoController}>
            <select
              id="cameraSelect"
              className={styles.cameraSelect}
              name="cameraSelect"
            />
            <InputButton
              type="button"
              name="streamingOn"
              value={buttonValue || "방송시작"}
            />
          </div>
        : null
      }
    </div>
  );
};

const volunteerTimeBoardStyle = { width: "20vh", height: "6vh" };
const inputStyle = { width: "85%" };
const inputButtonStyle = { width: "18%", marginLeft: "5%" };

export default Main;
