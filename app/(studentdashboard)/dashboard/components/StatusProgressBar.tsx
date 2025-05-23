'use client';

interface StatusProgressBarProps {
  progress: number;
}

export function StatusProgressBar({ progress }: StatusProgressBarProps) {
  
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full mx-auto p-6 bg-[#FCE7D2] rounded-xl">
      <p className=" font-semibold mb-3">Status</p>
      <div className="relative">
        {/* Progress bar background */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
          {/* First segment (Red) */}
          <div
            className="h-full bg-red-500 transition-all duration-500"
            style={{ width: `${Math.min(clampedProgress, 33.33)}%` }}
          />
          {/* Second segment (Yellow) */}
          <div
            className="h-full bg-yellow-400 transition-all duration-500"
            style={{
              width: `${
                clampedProgress > 33.33
                  ? Math.min(clampedProgress - 33.33, 33.33)
                  : 0
              }%`,
            }}
          />
          {/* Third segment (Green) */}
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{
              width: `${
                clampedProgress > 66.66
                  ? Math.min(clampedProgress - 66.66, 33.34)
                  : 0
              }%`,
            }}
          />
        </div>

        {/* Status markers */}
         <div className="absolute top-0 left-0 w-full flex justify-between -mt-1">
          <div className="relative">
            <div
              className={`w-3 h-3 rounded-full border-2 border-white ${
                clampedProgress >= 33 ? 'bg-red-500' : 'bg-gray-300'
              }`}
            />
          </div>
        {/*  <div className="relative">
            <div
              className={`w-3 h-3 rounded-full border-2 border-white ${
                clampedProgress >= 66 ? 'bg-yellow-400' : 'bg-gray-300'
              }`}
            />
          </div>
          <div className="relative">
            <div
              className={`w-3 h-3 rounded-full border-2 border-white ${
                clampedProgress >= 100 ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          </div> */}
        </div>

        {/* Labels  */}
         <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600">
          <span className="text-center">Incomplete</span>
          {/* <span className="text-center">In Process</span>
          <span className="text-center">Complete</span> */}
        </div> 
      </div>
    </div>
  );
}
