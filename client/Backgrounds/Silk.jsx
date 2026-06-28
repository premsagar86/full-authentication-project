import React from "react";

const Silk = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      <div className="absolute w-96 h-96 bg-blue-500 opacity-30 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-purple-500 opacity-30 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-cyan-400 opacity-20 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce"></div>
    </div>
  );
};

export default Silk;