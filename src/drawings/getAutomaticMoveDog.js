import getDogCharacter from "../utils/getDogCharacter";
import getRandomDogCoordinate from "../utils/getRandomDogCoordinates";

const getAutomaticMoveDog = (coordinates, drawElement, dog) => {
  let coordinate = coordinates.pop();
  const MOVE_DISTANCE = 10;
  const dogCharacter = getDogCharacter(dog);

  drawElement.sx = dogCharacter.walk.down.initX;
      drawElement.sy = dogCharacter.walk.down.initY;
      drawElement.sWidth = dogCharacter.walk.down.width;
      drawElement.sHeight = dogCharacter.walk.down.height;
      drawElement.dx = drawElement.dx || getRandomDogCoordinate(1000);
      drawElement.dy = drawElement.dy || getRandomDogCoordinate(980);
      drawElement.dWidth = dogCharacter.walk.down.width;
      drawElement.dHeight = dogCharacter.walk.down.height;

  const moveDog = () => {
    const isInCoordinateXBoundary
      = !coordinate
        || coordinate.x - 20 <= drawElement.dx
        && drawElement.dx <= coordinate.x + 20;
    const isInCoordinateYBoundary
      = !coordinate
        || coordinate.y - 20 <= drawElement.dy
        && drawElement.dy <= coordinate.y + 20;

    const shouldUpdateCoordinate
      = isInCoordinateYBoundary && isInCoordinateXBoundary

    if (shouldUpdateCoordinate) {
      coordinate = coordinates.pop();
      drawElement.sx = dogCharacter.walk.down.initX;
      drawElement.sy = dogCharacter.walk.down.initY;
      drawElement.sWidth = dogCharacter.walk.down.width;
      drawElement.sHeight = dogCharacter.walk.down.height;
      drawElement.dx = drawElement.dx;
      drawElement.dy = drawElement.dy;
      drawElement.dWidth = dogCharacter.walk.down.width;
      drawElement.dHeight = dogCharacter.walk.down.height;
      return;
    }

    if (coordinate.y < drawElement.dy) {
      dogCharacter.walk.toUp();
      drawElement.sx = dogCharacter.walk.up.x;
      drawElement.sy = dogCharacter.walk.up.y;
      drawElement.sWidth = dogCharacter.walk.up.width;
      drawElement.sHeight = dogCharacter.walk.up.height;
      drawElement.dy -= MOVE_DISTANCE;
      drawElement.dWidth = dogCharacter.walk.up.width;
      drawElement.dHeight = dogCharacter.walk.up.height;
    }

    if (drawElement.dy < coordinate.y) {
      dogCharacter.walk.toDown();
      drawElement.sx = dogCharacter.walk.down.x;
      drawElement.sy = dogCharacter.walk.down.y;
      drawElement.sWidth = dogCharacter.walk.down.width;
      drawElement.sHeight = dogCharacter.walk.down.height;
      drawElement.dy += MOVE_DISTANCE;
      drawElement.dWidth = dogCharacter.walk.down.width;
      drawElement.dHeight = dogCharacter.walk.down.height;
    }

    if (drawElement.dx < coordinate.x) {
      dogCharacter.walk.toRight();
      drawElement.sx = dogCharacter.walk.right.x;
      drawElement.sy = dogCharacter.walk.right.y;
      drawElement.sWidth = dogCharacter.walk.right.width;
      drawElement.sHeight = dogCharacter.walk.right.height;
      drawElement.dx += MOVE_DISTANCE;
      drawElement.dWidth = dogCharacter.walk.right.width;
      drawElement.dHeight = dogCharacter.walk.right.height;
    }

    if (coordinate.x < drawElement.dx) {
      dogCharacter.walk.toLeft();
      drawElement.sx = dogCharacter.walk.left.x;
      drawElement.sy = dogCharacter.walk.left.y;
      drawElement.sWidth = dogCharacter.walk.left.width;
      drawElement.sHeight = dogCharacter.walk.left.height;
      drawElement.dx -= MOVE_DISTANCE;
      drawElement.dWidth = dogCharacter.walk.left.width;
      drawElement.dHeight = dogCharacter.walk.left.height;
    }
  };

  const timeId = setInterval(moveDog, 100);

  return timeId;
};

export default getAutomaticMoveDog;
