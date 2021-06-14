import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import throttle from "lodash.throttle";

import {
  ReducerContext,
  selectors,
} from "../../features/rootSlice";
import popUpDogProfile from "./popUpDogProfile";
import drawCanvas from "./drawCanvas";
import socket from "../../socket/socket";
import getMyCharacterControllers from "../../drawings/getMyCharacterControllers";
import getAutomaticMoveDog from "../../drawings/getAutomaticMoveDog";
import getThrottleEmit from "../../utils/getThrottleEmit";
import getIndexOfObject from "../../utils/getIndexOfObject";

const emitMyCharacterDrawing = getThrottleEmit(
  60,
  { leading: false, trailing: true },
);

const useCanvasDraw = (ref) => {
  const history = useHistory();
  const { state } = useContext(ReducerContext);
  let userName = selectors.getUserName(state);
  const userCharacter = selectors.getUserCharacter(state);
  const isAdmin = selectors.getIsAdministrator(state);

  if (isAdmin) {
    userName += "(관리자)";
  }

  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    const { canvas } = ctx;
    let timeIds = [];
    const dogElements = [];
    let personElements = [];

    const clickEventHandler = popUpDogProfile(history, dogElements);
    canvas.addEventListener("click", clickEventHandler);
    drawCanvas(ctx, personElements, dogElements);

    const {
      myCharacterDrawingObject,
      walkMyCharacter,
      stopMyCharacter,
    } = getMyCharacterControllers(
          canvas.width,
          canvas.height,
          userCharacter,
          userName,
        );

    const throttledStopMyCharacter = throttle(
      (event) => walkMyCharacter(event),
      100,
      { leading: true, trailing: false }
    );

    emitMyCharacterDrawing(
      "user canvas image",
      myCharacterDrawingObject,
    );
    personElements.push(myCharacterDrawingObject);
    document.addEventListener(
      "keydown",
      throttledStopMyCharacter,
    );
    document.addEventListener(
      "keyup",
      stopMyCharacter
    );

    socket.on(
      "current users",
      (users) => {
        users.forEach((user) => personElements.push(user));
      },
    );
    socket.on(
      "another user draw element",
      (anotherUser) => {
        let hasUser = false;
        for (const element of personElements) {
          if (element.id === anotherUser.id) {
            hasUser = true;
            Object.assign(element, anotherUser);
            break;
          }
        }

        if (!hasUser) {
          personElements.push(anotherUser);
        }
      },
    );
    socket.on(
      "disconnected user",
      ({ id: anotherUserId }) => {
        personElements.splice(
          getIndexOfObject(anotherUserId, "id", personElements),
          1,
        );
      },
    );
    socket.on(
      "current dogs",
      (dogs) => {
        dogs.forEach((dog) => dogElements.push(dog));
        dogElements.map((dog) => getAutomaticMoveDog(dog));
        timeIds.push(
          setInterval(() => socket.emit("update all dogs"),  10 * 1000),
        );
      },
    );
    socket.on(
      "update a dog",
      (dog) => {
        const dogElement = dogElements.find(
          (dogEl) => dogEl._id === dog._id,
        );
        if (dogElement) {
          dogElement.targetCoordinates = dog.targetCoordinates;
          dogElement.hadRequest = false;
          dogElement.shouldUpdate = false;
        }
      },
    );
    socket.on(
      "update all dogs",
      (dogs) => {
        dogElements.forEach((dog) => dog.stop());
        dogElements.length = 0;
        dogs.forEach((dog) => dogElements.push(dog));
        dogElements.map((dog) => getAutomaticMoveDog(dog));
      },
    );

    return () => {
      timeIds.forEach((timeId) => clearInterval(timeId));
      dogElements.forEach((dog) => dog.stop());
      document.removeEventListener("keydown", throttledStopMyCharacter);
      document.removeEventListener("keyup", stopMyCharacter);
      personElements = [];
      [
        "current users",
        "another user draw element",
        "disconnected user",
        "current dogs",
        "update a dog",
      ].forEach((socketEvent) => socket.removeAllListeners(socketEvent));
    };
  }, [ref, history, userCharacter, userName]);
};

export default useCanvasDraw;
