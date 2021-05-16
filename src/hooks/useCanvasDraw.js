import { useEffect } from "react";
import { IMAGE_URLS } from "../constants/constants";
import socket from "../socket/socket";
import getMyCharacterControllers from "../drawings/getMyCharacterControllers";
import getAutomaticMoveDog from "../drawings/getAutomaticMoveDog";
import getThrottleEmit from "../utils/getThrottleEmit";
import throttle from "lodash.throttle";

const emitMyCharacterDrawing = getThrottleEmit(
  60,
  { leading: false, trailing: true },
);
const drawCanvas = throttle(
  (drawingFunction) => requestAnimationFrame(drawingFunction),
  1200,
);

const useCanvasDraw = (ref) => {
  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    const { canvas } = ctx;
    const humansImage = new Image();
    const dogsImage = new Image();
    humansImage.src = IMAGE_URLS.HUMAN_SPRITE;
    dogsImage.src = IMAGE_URLS.DOGS_SPRITE;
    const images = [humansImage, dogsImage];
    let timeIds = [];
    let dogElements = [];
    let humansElements = [];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      humansElements.forEach((humanElement, index) => {
        if (!index) {
          const shouldEmit
          = humanElement.lastDx !== humanElement.dx
          || humanElement.lastDy !== humanElement.dy;
          if (shouldEmit) {
            emitMyCharacterDrawing(
              "user canvas image",
              humanElement,
            );
          }
        }

        ctx.drawImage(
          humansImage,
          humanElement.sx,
          humanElement.sy,
          humanElement.sWidth,
          humanElement.sHeight,
          humanElement.dx,
          humanElement.dy,
          humanElement.dWidth,
          humanElement.dHeight,
        );
      });

      dogElements.forEach((dogElement) => {
        if (!dogElement.hadRequest && dogElement.shouldUpdate) {
          dogElement.hadRequest = true;
          socket.emit("update a dog for drawing", dogElement._id);
        }

        ctx.drawImage(
          dogsImage,
          dogElement.sx,
          dogElement.sy,
          dogElement.sWidth,
          dogElement.sHeight,
          dogElement.dx,
          dogElement.dy,
          dogElement.dWidth,
          dogElement.dHeight,
        );
      });

      drawCanvas(draw);
    };

    const checkImageLoad = () => {
      if (images.every((image) => image.complete)) {
        requestAnimationFrame(draw);
      }

      setTimeout(checkImageLoad, 100);
    };

    const {
      myCharacterDrawingObject,
      walkMyCharacter,
      stopMyCharacter,
    } = getMyCharacterControllers(canvas.width, canvas.height, "human7");

    emitMyCharacterDrawing(
      "user canvas image",
      myCharacterDrawingObject,
    );

    humansElements.push(myCharacterDrawingObject);
    document.addEventListener("keydown", throttle((event) => walkMyCharacter(event), 100, { leading: true, trailing: false }));
    document.addEventListener("keyup", stopMyCharacter);
    checkImageLoad();

    socket.on(
      "current users",
      (otherDrawElements) => {
        humansElements = humansElements.concat(otherDrawElements);
      },
    );
    socket.on(
      "another user draw element",
      (anotherUserDrawElement) => {
        let hasUser = false;
        for (const element of humansElements) {
          if (element.id === anotherUserDrawElement.id) {
            hasUser = true;
            Object.assign(element, anotherUserDrawElement);
            break;
          }
        }

        if (!hasUser) {
          humansElements.push(anotherUserDrawElement);
        }
      },
    );
    socket.on(
      "disconnected user",
      ({ id: anotherUserId }) => {
        humansElements = humansElements.filter(
          (element) => element.id !== anotherUserId,
        );
      },
    );
    socket.on(
      "current dogs",
      (dogs) => {
        dogElements = dogs;
        timeIds = dogElements.map((dog) => {
          const { timeId } = getAutomaticMoveDog(dog);
          return timeId;
        });
        timeIds.push(setInterval(() => socket.emit("update all dog")));
      },
    );
    socket.on(
      "update a dog",
      (dog) => {
        const dogElement = dogElements.find(
          (dogEl) => dogEl._id === dog._id,
        );
        dogElement.targetCoordinates = dog.targetCoordinates;
        dogElement.hadRequest = false;
        dogElement.shouldUpdate = false;
      },
    );

    return () => {
      timeIds.forEach((timeId) => clearInterval(timeId));
      socket.removeAllListeners();
    };
  }, [ref]);
};

export default useCanvasDraw;
