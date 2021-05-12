import { io } from "socket.io-client";

const socket = io(
  process.env.REACT_APP_SERVER_URL,
  {
    autoConnect: false,
  }
);

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
