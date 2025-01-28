import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import { AppContextProvider } from "./Context/AppContext";
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

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <AppContextProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/register/:schoolName"
                element={<RegisterPageForSchool />}
              />
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
                </Route>
                <Route path="level/:levelId" element={<LevelPage />} />
              </Route>
            </Routes>
          </Router>
        </AppContextProvider>
      </div>
    </div>
  );
}

export default App;
