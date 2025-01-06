import { Button } from "@/components/ui/button"
import { Navigate, useNavigate } from 'react-router-dom'
import owlMascotImage from "../assets/owl_image.png"
import { useContext } from "react"
import { AppContext } from "@/Context/AppContext"
import { AppContextType } from "@/types"

const LandingPage = () => {
    const {loggedInUser} = useContext(AppContext) as AppContextType;
    const navigate = useNavigate();
  
  
    if(loggedInUser!==null) return <Navigate to="/subjects"/>

    return (
    <div className="min-h-screen bg-[#EEF6FF] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center space-y-8">
        {/* School Logo/Text */}
        <div className="bg-white px-8 py-3 rounded-xl shadow-sm">
          <span className="text-gray-600 text-lg">School Name</span>
        </div>

        {/* Owl Mascot */}
        <div className="w-56 h-56 relative">
          <img
            src={owlMascotImage}
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

export default LandingPage;


