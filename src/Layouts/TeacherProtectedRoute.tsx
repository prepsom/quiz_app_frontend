import { AppContext } from "@/Context/AppContext";
import { AppContextType } from "@/types";
import React, { useContext } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";

const TeacherProtectedRoute = () => {
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

  return <Outlet />;
};

export default TeacherProtectedRoute;
