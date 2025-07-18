"use client"

export const CricketLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
      <div className="text-center">
        {/* Cricket Animation Container */}
        <div className="relative mb-8">
          <div className="cricket-scene">
            {/* Cricket Bat */}
            <div className="cricket-bat">
              <div className="bat-handle"></div>
              <div className="bat-blade">
                <div className="bat-grip"></div>
                <div className="bat-sweet-spot"></div>
              </div>
            </div>

            {/* Cricket Ball */}
            <div className="cricket-ball">
              <div className="ball-seam"></div>
              <div className="ball-seam ball-seam-2"></div>
            </div>

            {/* Impact Effect */}
            <div className="impact-effect">
              <div className="spark spark-1"></div>
              <div className="spark spark-2"></div>
              <div className="spark spark-3"></div>
              <div className="spark spark-4"></div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 tracking-wide">
            <span className="inline-block animate-pulse">CricGears</span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: "0.10s" }}>
              STORE
            </span>
          </h2>

          {/* Animated Loading Dots */}
          <div className="flex justify-center items-center space-x-2">
            <div className="loading-dot"></div>
            <div className="loading-dot" style={{ animationDelay: "0.2s" }}></div>
            <div className="loading-dot" style={{ animationDelay: "0.4s" }}></div>
          </div>

          <p className="text-gray-600 text-lg font-medium tracking-wide">Loading Premium Cricket Bats...</p>
        </div>
      </div>

      <style jsx>{`
        .cricket-scene {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto;
        }
        
        .cricket-bat {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          transform-origin: bottom center;
          animation: batSwing 2s ease-in-out infinite;
          z-index: 2;
        }
        
        .bat-handle {
          width: 12px;
          height: 60px;
          background: linear-gradient(to bottom, #2d2d2d, #1a1a1a);
          margin: 0 auto;
          border-radius: 6px;
          position: relative;
          box-shadow: inset 2px 0 4px rgba(255,255,255,0.1);
        }
        
        .bat-blade {
          width: 35px;
          height: 90px;
          background: linear-gradient(to bottom, #f8f8f8, #e0e0e0);
          margin: -8px auto 0;
          border-radius: 17px 17px 6px 6px;
          border: 3px solid #333;
          position: relative;
          box-shadow: 
            inset 0 2px 4px rgba(255,255,255,0.3),
            0 4px 8px rgba(0,0,0,0.2);
        }
        
        .bat-grip {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 20px;
          background: #333;
          border-radius: 8px 8px 0 0;
        }
        
        .bat-sweet-spot {
          position: absolute;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 30px;
          border: 2px solid #666;
          border-radius: 10px;
          opacity: 0.3;
        }
        
        .cricket-ball {
          position: absolute;
          top: 30px;
          right: 20px;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle at 30% 30%, #ffffff, #d0d0d0);
          border-radius: 50%;
          border: 2px solid #333;
          animation: ballFly 2s ease-in-out infinite;
          z-index: 1;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .ball-seam {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: #333;
          transform: translateY(-50%);
          border-radius: 1px;
        }
        
        .ball-seam-2 {
          transform: translateY(-50%) rotate(90deg);
        }
        
        .impact-effect {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          animation: impact 2s ease-in-out infinite;
        }
        
        .spark {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #333;
          border-radius: 50%;
        }
        
        .spark-1 { top: -10px; left: -10px; animation: sparkFly1 0.3s ease-out infinite; }
        .spark-2 { top: -10px; right: -10px; animation: sparkFly2 0.3s ease-out infinite; }
        .spark-3 { bottom: -10px; left: -10px; animation: sparkFly3 0.3s ease-out infinite; }
        .spark-4 { bottom: -10px; right: -10px; animation: sparkFly4 0.3s ease-out infinite; }
        
        .loading-dot {
          width: 8px;
          height: 8px;
          background: #333;
          border-radius: 50%;
          animation: dotBounce 1.4s ease-in-out infinite both;
        }
        
        @keyframes batSwing {
          0% { transform: translate(-50%, -50%) rotate(-45deg); }
          45% { transform: translate(-50%, -50%) rotate(-45deg); }
          50% { transform: translate(-50%, -50%) rotate(15deg); }
          55% { transform: translate(-50%, -50%) rotate(15deg); }
          100% { transform: translate(-50%, -50%) rotate(-45deg); }
        }
        
        @keyframes ballFly {
          0% { 
            transform: translateX(0) translateY(0) scale(1); 
            opacity: 1; 
          }
          45% { 
            transform: translateX(-80px) translateY(20px) scale(1); 
            opacity: 1; 
          }
          50% { 
            transform: translateX(-100px) translateY(25px) scale(1.2); 
            opacity: 1; 
          }
          55% { 
            transform: translateX(-120px) translateY(20px) scale(1); 
            opacity: 0.8; 
          }
          100% { 
            transform: translateX(-200px) translateY(-40px) scale(0.8); 
            opacity: 0; 
          }
        }
        
        @keyframes impact {
          0%, 45%, 55%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes sparkFly1 {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(-15px, -15px); opacity: 0; }
        }
        
        @keyframes sparkFly2 {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(15px, -15px); opacity: 0; }
        }
        
        @keyframes sparkFly3 {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(-15px, 15px); opacity: 0; }
        }
        
        @keyframes sparkFly4 {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(15px, 15px); opacity: 0; }
        }
        
        @keyframes dotBounce {
          0%, 80%, 100% { 
            transform: scale(0.8); 
            opacity: 0.5; 
          }
          40% { 
            transform: scale(1.2); 
            opacity: 1; 
          }
        }
        
        @media (max-width: 640px) {
          .cricket-scene {
            width: 150px;
            height: 150px;
          }
          
          .bat-handle {
            width: 10px;
            height: 45px;
          }
          
          .bat-blade {
            width: 28px;
            height: 70px;
          }
          
          .cricket-ball {
            width: 16px;
            height: 16px;
          }
          
          .bat-grip {
            width: 14px;
            height: 16px;
          }
          
          .bat-sweet-spot {
            width: 16px;
            height: 24px;
          }
        }
        
        @media (max-width: 480px) {
          .cricket-scene {
            width: 120px;
            height: 120px;
          }
          
          .bat-handle {
            width: 8px;
            height: 36px;
          }
          
          .bat-blade {
            width: 22px;
            height: 56px;
          }
          
          .cricket-ball {
            width: 14px;
            height: 14px;
          }
        }
      `}</style>
    </div>
  )
}
