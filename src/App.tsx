import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import { AppContext, AppContextProvider } from "./Context/AppContext";
import ProtectedRoute from "./Layouts/ProtectedRoute";
import LandingPage from "./Pages/LandingPage";
import SubjectsPage from "./Pages/SubjectsPage";
import Layout from "./Layouts/Layout";
import LevelsPage from "./Pages/LevelsPage";
import LevelPage from "./Pages/LevelPage";
import LeaderBoardPage from "./Pages/LeaderBoardPage";
import ProfilePage from "./Pages/ProfilePage";
import ProfileLevelsPage from "./Pages/ProfileLevelsPage";
import RegisterPage from "./Pages/RegisterPage";
import RegisterPageForSchool from "./Pages/RegisterPageForSchool";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import AdminProtectedRoute from "./Layouts/AdminProtectedRoute";
import AdminSchoolsPage from "./Pages/AdminSchoolsPage";
import AdminGradesPage from "./Pages/AdminGradesPage";
import AdminSubjectsPage from "./Pages/AdminSubjectsPage";
import AdminLevelsPage from "./Pages/AdminLevelsPage";
import AdminQuestionsPage from "./Pages/AdminQuestionsPage";
import AdminStudentsPage from "./Pages/AdminStudentsPage";
import AdminUserProfilePage from "./Pages/AdminUserProfilePage";
import TeacherProtectedRoute from "./Layouts/TeacherProtectedRoute";
import TeacherGradesPage from "./Pages/TeacherGradesPage";
import AdminNotificationsPage from "./Pages/AdminNotificationsPage";
import ChatPage from "./Pages/ChatPage";
import ChatWidget from "./Pages/ChatWidget";
import { useContext } from "react";
import { AppContextType } from "./types";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <AppContextProvider>
          <Router>
            <Routes>
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordPage />}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/register/:schoolName"
                element={<RegisterPageForSchool />}
              />
              <Route path="/admin" element={<AdminProtectedRoute />}>
                <Route path="schools" element={<AdminSchoolsPage />} />
                <Route path="grades/:schoolId" element={<AdminGradesPage />} />
                <Route
                  path="subjects/:gradeId"
                  element={<AdminSubjectsPage />}
                />
                <Route path="levels/:subjectId" element={<AdminLevelsPage />} />
                <Route
                  path="questions/:levelId"
                  element={<AdminQuestionsPage />}
                />
                <Route
                  path="students/:gradeId"
                  element={<AdminStudentsPage />}
                />
                <Route
                  path="profile/:userId"
                  element={<AdminUserProfilePage />}
                />
                <Route
                  path="notifications/:gradeId"
                  element={<AdminNotificationsPage />}
                />
              </Route>
              <Route path="teacher" element={<TeacherProtectedRoute />}>
                <Route path="grades" element={<TeacherGradesPage />} />
                <Route
                  path="subjects/:gradeId"
                  element={<AdminSubjectsPage />}
                />
                <Route
                  path="students/:gradeId"
                  element={<AdminStudentsPage />}
                />
                <Route path="levels/:subjectId" element={<AdminLevelsPage />} />
                <Route
                  path="profile/:userId"
                  element={<AdminUserProfilePage />}
                />
                <Route
                  path="questions/:levelId"
                  element={<AdminQuestionsPage />}
                />
                <Route
                  path="notifications/:gradeId"
                  element={<AdminNotificationsPage />}
                />
              </Route>
              <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<LandingPage />} />
                <Route path="/" element={<Layout />}>
                  <Route path="profile" element={<ProfilePage />} />
                  <Route
                    path="profile/:subjectId"
                    element={<ProfileLevelsPage />}
                  />
                  <Route path="subjects" element={<SubjectsPage />} />
                  <Route path="leaderboard" element={<LeaderBoardPage />} />
                  <Route path="levels/:subjectId" element={<LevelsPage />} />
                  <Route path="chat" element={<ChatPage />} />
                </Route>
                <Route path="level/:levelId" element={<LevelPage />} />
              </Route>
            </Routes>
            <ProtectedChatWidget />
          </Router>
        </AppContextProvider>
      </div>
    </div>
  );
}

function ProtectedChatWidget() {
  const { loggedInUser } = useContext(AppContext) as AppContextType;

  if (loggedInUser === null) {
    return <Navigate to="/login" />;
  }

  if (loggedInUser.role === "ADMIN") {
    return <Navigate to="/admin/schools" />;
  }

  if (loggedInUser.role === "TEACHER") {
    return <Navigate to="/teacher/grades" />;
  }

  return <ChatWidget />;
}

export default App;
