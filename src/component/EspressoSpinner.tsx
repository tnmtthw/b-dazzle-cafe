import React from "react";

const EspressoSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-32 w-32 animate-pulse">
      <svg
        width="100"
        height="100"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Plate */}
        <ellipse
          cx="32"
          cy="52"
          rx="20"
          ry="4"
          className="fill-gray-300"
        />
        {/* Cup */}
        <rect
          x="16"
          y="28"
          width="32"
          height="20"
          rx="4"
          className="fill-white stroke-current text-gray-700"
          strokeWidth="2"
        />
        {/* Handle */}
        <path
          d="M48 30c4 0 4 12 0 12"
          className="stroke-current text-gray-700"
          strokeWidth="2"
          fill="none"
        />
        {/* Steam */}
        <path
          d="M26 20c0-4 4-4 4-8"
          className="stroke-current text-gray-400 animate-steam"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M34 20c0-4 4-4 4-8"
          className="stroke-current text-gray-400 animate-steam delay-200"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      <style jsx>{`
        .animate-steam {
          animation: steam 1.5s infinite ease-in-out;
        }

        @keyframes steam {
          0% {
            opacity: 0;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-4px) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translateY(-8px) scale(1.2);
          }
        }

        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default EspressoSpinner;