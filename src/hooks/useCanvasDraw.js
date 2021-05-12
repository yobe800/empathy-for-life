import { useEffect } from "react";
import { IMAGE_URLS } from "../constants/constants";
import socket from "../socket/socket";
import getMyCharacterControllers from "../drawings/getMyCharacterControllers";
import getAutomaticMoveDog from "../drawings/getAutomaticMoveDog";
import getRandomDogCoordinate from "../utils/getRandomDogCoordinates";

const useCanvasDraw = (ref) => {
  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    const { canvas } = ctx;
    const humansImage = new Image();
    const dogsImage = new Image();
    humansImage.src = IMAGE_URLS.HUMAN_SPRITE;
    dogsImage.src = IMAGE_URLS.DOGS_SPRITE;
    const images = [humansImage, dogsImage];
    const randomCoordinates = [];
    const dogElements = Array(10).fill(null).map(() => ({ type: "dog" }));
    let drawElements = [];

    const draw = () => {
      socket.emit("user canvas image", drawElements[0]);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawElements.forEach((drawElement) => {
        if (drawElement.type === "human") {
          ctx.drawImage(
            humansImage,
            drawElement.sx,
            drawElement.sy,
            drawElement.sWidth,
            drawElement.sHeight,
            drawElement.dx,
            drawElement.dy,
            drawElement.dWidth,
            drawElement.dHeight,
          );
        }

        if (drawElement.type === "dog") {
          ctx.drawImage(
            dogsImage,
            drawElement.sx,
            drawElement.sy,
            drawElement.sWidth,
            drawElement.sHeight,
            drawElement.dx,
            drawElement.dy,
            drawElement.dWidth,
            drawElement.dHeight,
          );
        }
      });

      requestAnimationFrame(draw);
    };

    const checkImageLoad = () => {
      if (images.every((image) => image.complete)) {
        requestAnimationFrame(draw);
        dogElements.forEach((el) => {
          getAutomaticMoveDog(randomCoordinates, el, "s");
        });
        drawElements.push(...dogElements);
        return;
      }

      setTimeout(checkImageLoad, 100);
    };

    const {
      myCharacterDrawingObject,
      walkMyCharacter,
      stopMyCharacter,
    } = getMyCharacterControllers(canvas.width, canvas.height, "human3");

    drawElements.push(myCharacterDrawingObject);
    document.addEventListener("keydown", walkMyCharacter);
    document.addEventListener("keyup", stopMyCharacter);
    checkImageLoad();
    setInterval(() => {
      if (10 < randomCoordinates.length) {
        return;
      }
      const x = getRandomDogCoordinate(1000);
      const y = getRandomDogCoordinate(920);
      randomCoordinates.push({ x, y });
    }, 300);

    socket.on(
      "another user draw element",
      (anotherUserDrawElement) => {
        let hasUser = false;
        for (const element of drawElements) {
          if (element.id === anotherUserDrawElement.id) {
            hasUser = true;
            Object.assign(element, anotherUserDrawElement);
            break;
          }
        }

        if (!hasUser) {
          drawElements.push(anotherUserDrawElement);
        }
      },
    );

    socket.on("disconnected user", (anotherUserId) => {
      drawElements = drawElements.filter((element) => element.id !== anotherUserId);
    });
  }, [ref]);
};

export default useCanvasDraw;
