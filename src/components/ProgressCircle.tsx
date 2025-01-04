interface ProgressCircleProps {
    progress: number;
    color: string;
    size?: number;
  }
  
  export function ProgressCircle({ progress, color, size = 40 }: ProgressCircleProps) {
    const circumference = 2 * Math.PI * 16; // radius = 16
    const strokeDashoffset = circumference - (progress / 100) * circumference;
  
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox="0 0 40 40"
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke={color}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
          {progress}%
        </div>
      </div>
    );
  }
  
  