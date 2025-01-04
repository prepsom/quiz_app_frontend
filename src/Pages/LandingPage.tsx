import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#EEF6FF] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center space-y-8">
        {/* School Logo/Text */}
        <div className="bg-white px-8 py-3 rounded-xl shadow-sm">
          <span className="text-gray-600 text-lg">Your School</span>
        </div>

        {/* Owl Mascot */}
        <div className="w-48 h-48 relative">
          <img
            src="/placeholder.svg?height=192&width=192"
            alt="Owl mascot with graduation cap"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Welcome Text */}
        <h1 className="text-blue-500 text-2xl font-bold">
          Welcome to PrepSOM!
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center max-w-sm">
          Master concepts with interactive lessons, quick quizzes, and step-by-step solutions
          —tailored for your success!
        </p>

        {/* Get Started Button */}
        <Button 
          onClick={() => navigate("/subjects")}
          className="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg"
        >
          GET STARTED
        </Button>
      </div>
    </div>
  )
}

export default LandingPage

