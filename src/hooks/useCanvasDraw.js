import { useEffect } from "react";
import { IMAGE_URLS } from "../constants/constants";
import getMyCharacterControllers from "../drawings/getMyCharacterControllers";
import getDogCharacter from "../utils/getDogCharacter";
import getRandomDogCoordinates from "../utils/getRandomDogCoordinates";

const useCanvasDraw = (ref) => {
  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    const { canvas } = ctx;
    const humansImage = new Image();
    const dogsImage = new Image();
    humansImage.src = IMAGE_URLS.HUMAN_SPRITE;
    dogsImage.src = IMAGE_URLS.DOGS_SPRITE;
    const images = [humansImage, dogsImage];
    const drawElements = [];

    const draw = () => {
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
      });
      requestAnimationFrame(draw);
    };

    const checkImageLoad = () => {
      if (images.every((image) => image.complete)) {
        requestAnimationFrame(draw);
        return;
      }

      setTimeout(checkImageLoad, 100);
    };

    const {
      myCharacterDrawingObject,
      walkMyCharacter,
      stopMyCharacter,
    } = getMyCharacterControllers(canvas.width, canvas.height);

    drawElements.push(myCharacterDrawingObject);
    document.addEventListener("keydown", walkMyCharacter);
    document.addEventListener("keyup", stopMyCharacter);
    checkImageLoad();
  }, [ref]);
};

export default useCanvasDraw;
