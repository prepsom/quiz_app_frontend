import { Clock } from 'lucide-react'

interface TimerProps {
  seconds: number
}

export function Timer({ seconds }: TimerProps) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return (
    <div className="flex items-center justify-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border">
      <Clock className="w-4 h-4 text-blue-500" />
      <span className="font-mono text-lg font-medium text-gray-700">
        {String(minutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}
      </span>
    </div>
  )
}

