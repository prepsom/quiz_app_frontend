import { AppContext } from "@/Context/AppContext";
import { AppContextType } from "@/types";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { loggedInUser } = useContext(AppContext) as AppContextType;

  if (loggedInUser === null) {
    return <Navigate to="/login" />;
  }

  if(loggedInUser.role==="ADMIN") {
    return <Navigate to="/admin/schools"/>
  }

  if(loggedInUser.role==="TEACHER") {
    return <Navigate to="/teacher/grades"/>
  }

  return <Outlet />;
};

export default ProtectedRoute;
