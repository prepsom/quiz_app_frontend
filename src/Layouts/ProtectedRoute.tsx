import { AppContext } from "@/Context/AppContext"
import { AppContextType } from "@/types"
import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {

    const {loggedInUser} = useContext(AppContext) as AppContextType;

    if(loggedInUser===null) {
        return <Navigate to="/"/>
    }

    return <Outlet/>
}

export default ProtectedRoute;
