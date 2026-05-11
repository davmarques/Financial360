import React from 'react';

const Loading = ({ fullScreen = false, message = "Carregando..." }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-12 h-12 rounded-full border-4 border-[#F2F2F2]"></div>
        {/* Animated Ring */}
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-[#277C78] border-t-transparent animate-spin"></div>
      </div>
      <p className="text-[#696868] text-preset-4 animate-pulse font-medium">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#F8F9FB] flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      {loaderContent}
    </div>
  );
};

export default Loading;
