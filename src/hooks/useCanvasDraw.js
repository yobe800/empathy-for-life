import { useEffect } from "react";
import { IMAGE_URLS } from "../constants/constants";
import { drawMyCharacter } from "../drawings/drawUserCharacter";

const useCanvasDraw = (ref) => {

  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    const { canvas } = ctx;
    const humansImage = new Image();
    const dogsImage = new Image();
    dogsImage.src = IMAGE_URLS.DOGS_SPRITE;
    humansImage.src = IMAGE_URLS.HUMAN_SPRITE;
    humansImage.onload = beginDrawingHuman;
    dogsImage.onload = beginDrawingDogs;

    function beginDrawingHuman() {
      drawMyCharacter.call(this, ctx, "human0");
    }

    function beginDrawingDogs() {
      ctx.drawImage(this, 22, 12, 44, 78, 100, 500, 44, 78);
    }
  }, [ref]);
};

export default useCanvasDraw;
