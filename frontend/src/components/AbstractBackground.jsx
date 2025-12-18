import React from "react";

const AbstractBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#EEF4FF] via-[#EAF2FF] to-[#F5F8FF]">

      
      <div className="absolute -top-24 -right-24 w-[420px] h-[420px] bg-indigo-700/30 rounded-full blur-3xl" />
      <div className="absolute top-[30%] -left-32 w-[360px] h-[360px] bg-purple-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-120px] right-[20%] w-[420px] h-[420px] bg-blue-500/40 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(#00000010_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.03]" />
      <div className="relative z-10 pt-28">
        {children}
      </div>
    </div>
  );
};

export default AbstractBackground;
