import React from "react";

const Loading = ({ className }) => {
  return (
    <img
      className={className}
      src="/assets/images/running-shiba.gif"
      alt="A running shiba dog"
    />
  );
};

export default Loading;
