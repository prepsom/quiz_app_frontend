import { AppContext } from "@/Context/AppContext";
import { AppContextType } from "@/types";
import { useContext } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const { loggedInUser } = useContext(AppContext) as AppContextType;

  if (!loggedInUser) {
    return <Navigate to="/login" />;
  }

  if (loggedInUser && loggedInUser.role === "STUDENT") {
    return (
      <>
        <div className="flex items-center justify-center mt-28 gap-4">
          <span>Unauthorized to access this content</span>
          <Link to="/subjects">Back to home</Link>
        </div>
      </>
    );
  }

  if (loggedInUser && loggedInUser.role === "TEACHER") {
    return (
      <>
        <div className="flex items-center justify-center mt-28 gap-4">
          <span>Unauthorized to access this content</span>
        </div>
      </>
    );
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
