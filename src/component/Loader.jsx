import React from "react";
import Lottie from "react-lottie-player";
import animationData from "../assets/loader.json";

const Loader = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Lottie
        loop
        play
        animationData={animationData}
        style={{ width: 200 }}
      />
    </div>
  );
};

export default Loader;
