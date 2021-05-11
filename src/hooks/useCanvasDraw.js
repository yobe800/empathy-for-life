import { useEffect } from "react";
import { IMAGE_URLS, DIRECTIONS } from "../constants/constants";
import getHumanCharacter from "../utils/getHumanCharacter";

const useCanvasDraw = (ref) => {

  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    const { canvas } = ctx;
    const humanImage = new Image();
    humanImage.src = IMAGE_URLS.HUMAN_SPRITE;
    humanImage.onload = beginDrawingHuman;

    function beginDrawingHuman() {
      const myCharacter = getHumanCharacter("human0");
      const drawSize = myCharacter.CHRACTER_SIZE * 2;
      let drawX = 0;
      let drawY = 0;
      let moveDistance = 10;

      ctx.drawImage(
        this,
        myCharacter.walk.down.x,
        myCharacter.walk.down.y,
        myCharacter.walk.down.width,
        myCharacter.walk.down.height,
        drawX,
        drawY,
        drawSize,
        drawSize,
      );

      const walkMyCharacter = (event) => {
        const direction = DIRECTIONS[event.keyCode];
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (direction === "up") {
          ctx.drawImage(
            this,
            myCharacter.walk.up.x,
            myCharacter.walk.up.y,
            myCharacter.walk.up.width,
            myCharacter.walk.up.height,
            drawX,
            drawY,
            drawSize,
            drawSize,
          );

          if (myCharacter.walk.up.x === myCharacter.walk.up.maxX) {
            myCharacter.walk.up.x = myCharacter.walk.up.initX;
          } else {
            myCharacter.walk.up.x += myCharacter.walk.up.gap;
          }

          if (0 < drawY) {
            drawY -= moveDistance;
          }
        }

        if (direction === "right") {
          ctx.drawImage(
            this,
            myCharacter.walk.right.x,
            myCharacter.walk.right.y,
            myCharacter.walk.right.width,
            myCharacter.walk.right.height,
            drawX,
            drawY,
            drawSize,
            drawSize,
          );

          if (myCharacter.walk.right.x === myCharacter.walk.right.maxX) {
            myCharacter.walk.right.x = myCharacter.walk.right.initX;
          } else {
            myCharacter.walk.right.x += myCharacter.walk.right.gap;
          }

          if (drawX < canvas.width - drawSize) {
            drawX += moveDistance;
          }
        }

        if (direction === "down") {
          ctx.drawImage(
            this,
            myCharacter.walk.down.x,
            myCharacter.walk.down.y,
            myCharacter.walk.down.width,
            myCharacter.walk.down.height,
            drawX,
            drawY,
            drawSize,
            drawSize,
          );

          if (myCharacter.walk.down.x === myCharacter.walk.down.maxX) {
            myCharacter.walk.down.x = myCharacter.walk.down.initX;
          } else {
            myCharacter.walk.down.x += myCharacter.walk.down.gap;
          }

          if (drawY < canvas.height - drawSize) {
            drawY += moveDistance;
          }
        }

        if (direction === "left") {
          ctx.drawImage(
            this,
            myCharacter.walk.left.x,
            myCharacter.walk.left.y,
            myCharacter.walk.left.width,
            myCharacter.walk.left.height,
            drawX,
            drawY,
            drawSize,
            drawSize,
          );

          if (myCharacter.walk.left.x === myCharacter.walk.left.maxX) {
            myCharacter.walk.left.x = myCharacter.walk.left.initX;
          } else {
            myCharacter.walk.left.x += myCharacter.walk.left.gap;
          }

          if (0 < drawX) {
            drawX -= moveDistance;
          }
        }
      };

      const stopMyCharacter = (event) => {
        const direction = DIRECTIONS[event.keyCode];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        myCharacter.walk[direction].x = myCharacter.walk[direction].initX;
        myCharacter.walk[direction].y = myCharacter.walk[direction].initY;
        ctx.drawImage(
          this,
          myCharacter.walk[direction].x,
          myCharacter.walk[direction].y,
          myCharacter.walk[direction].width,
          myCharacter.walk[direction].height,
          drawX,
          drawY,
          drawSize,
          drawSize,
        );

      };

      document.addEventListener("keydown", walkMyCharacter);
      document.addEventListener("keyup", stopMyCharacter);
    };
  }, [ref]);
};

export default useCanvasDraw;
