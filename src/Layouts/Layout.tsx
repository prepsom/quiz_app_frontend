import { Navigation } from "@/components/Navigation";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 pb-14">
      <Outlet />
      <Navigation />
    </div>
  );
}
