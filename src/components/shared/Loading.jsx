import React from "react";

const Loading = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="text-white text-xl mb-4">loading...</div>
      <div className="relative w-[500px] max-w-[90vw]">
        <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-progress-loading" />
        </div>
        <div className="absolute inset-0 flex">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-full border-r border-white/20"
              style={{
                animationDelay: `${i * 20}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
