import { useEffect } from "react";

const useCanvasDraw = (ref) => {

  useEffect(() => {
    const context = ref.current.getContext("2d");

    const draw = (ctx) => {

    };

    draw(context);
  }, [ref]);
};

export default useCanvasDraw;
