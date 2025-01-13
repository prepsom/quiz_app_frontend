import { Home, Trophy, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();

  return (
    <div className="fixed w-full max-w-md m-auto bottom-0 left-0 right-0 flex justify-center bg-white">
      <nav className="w-full max-w-md border-t py-2 px-4">
        <div className="flex justify-around items-center">
          <Link
            to="/subjects"
            className={`flex flex-col items-center gap-1 ${
              location.pathname === "/subjects"
                ? "text-blue-500"
                : "text-gray-500"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/leaderboard"
            className={`flex flex-col items-center gap-1 ${
              location.pathname === "/leaderboard"
                ? "text-blue-500"
                : "text-gray-500"
            }`}
          >
            <Trophy className="w-6 h-6" />
            <span className="text-xs">Leaderboard</span>
          </Link>
          <Link 
            to="/profile"
            className={`flex flex-col items-center gap-1 ${
              location.pathname === '/profile' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
