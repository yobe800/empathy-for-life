import { AXIS_CORRECTION } from "../../constants/constants";

const getClickedDogId = (dogs, { offsetX, offsetY }) => {
  const clickedX = Math.trunc(offsetX * AXIS_CORRECTION.x);
  const clickedY = Math.trunc(offsetY * AXIS_CORRECTION.y);

  const clickedDog = dogs.find((dog) => {
    const isMatchedX = dog.dx <= clickedX && clickedX <= dog.dx + dog.dWidth;
    const isMatchedY = dog.dy <= clickedY && clickedY <= dog.dy + dog.dHeight;

    return isMatchedX && isMatchedY;
  });

  return clickedDog?._id;
};

export default getClickedDogId;
