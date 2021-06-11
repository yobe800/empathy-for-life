import { useLocation } from "react-router-dom";

const useModalLocationGet = () => {
  const { pathname, state } = useLocation();
  const { modal } = state;

  return { pathname, modal };
};

export default useModalLocationGet;
