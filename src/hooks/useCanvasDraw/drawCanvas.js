import socket from "../../socket/socket";
import { IMAGE_URLS } from "../../constants/constants";
import createImage from "../../utils/createImage";

const drawCanvas = (ctx, persons, dogs) => {
  ctx.font = "3vh neodgm";
  ctx.fillStyle = "white";
  const { width, height } = ctx.canvas;
  const personsSprite = createImage(IMAGE_URLS.PERSON_SPRITE);
  const dogsSprite = createImage(IMAGE_URLS.DOGS_SPRITE);
  const images = [personsSprite, dogsSprite];

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    persons.forEach((person, index) => {
     if (!index) {
       const shouldEmit
       = person.lastDx !== person.dx
       || person.lastDy !== person.dy;

       if (shouldEmit) {
         socket.emit(
           "user canvas image",
           person,
         );
       }
     }

     ctx.drawImage(
      personsSprite,
       person.sx,
       person.sy,
       person.sWidth,
       person.sHeight,
       person.dx,
       person.dy,
       person.dWidth,
       person.dHeight,
     );
     ctx.fillText(
       person.name,
       person.dx,
       person.dy + person.dHeight + 20,
     );
    });
    dogs.forEach((dog) => {
      if (!dog.hadRequest && dog.shouldUpdate) {
        dog.hadRequest = true;
        socket.emit("update a dog for drawing", dog._id);
      }

      ctx.drawImage(
        dogsSprite,
        dog.sx,
        dog.sy,
        dog.sWidth,
        dog.sHeight,
        dog.dx,
        dog.dy,
        dog.dWidth,
        dog.dHeight,
      );
      ctx.fillText(
        dog.name,
        dog.dx,
        dog.dy + dog.dHeight + 20,
      );
    });
    requestAnimationFrame(draw);
  };

  const checkImageLoad = () => {
    if (images.every((image) => image.complete)) {
      requestAnimationFrame(draw);
    } else {
      setTimeout(checkImageLoad, 100);
    }
  };

  checkImageLoad();
};

export default drawCanvas;
