"use client";

import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, EyeIcon, EyeOffIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AppContextType, LoginRequest, LoginResponse } from "@/types";
import { API_URL } from "@/App";
import { AppContext } from "@/Context/AppContext";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import owlMascot from "../assets/owl_image.png";
import circleLoaderSvg from "../../public/circleLoader.svg";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });
  const { loggedInUser, setLoggedInUser } = useContext(
    AppContext
  ) as AppContextType;

  if (loggedInUser !== null) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setFieldErrors({ email: "", password: "" });

    const errors = {
      email: "",
      password: "",
    };

    if (!formData.email) {
      errors.email = "Email is required";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    if (errors.password || errors.email) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/auth/login`,
        formData,
        {
          withCredentials: true,
        }
      );
      setLoggedInUser(response.data.user);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-blue-500/[0.025] -z-10" />
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="absolute w-[500px] h-[500px] bg-blue-500/10 rounded-full" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/10 rounded-full translate-x-32" />
      </div>

      <Card className="w-full max-w-md p-8 space-y-8 bg-white/80 shadow-2xl rounded-2xl border border-blue-100/50 transition-all duration-300 hover:shadow-blue-200/50">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-32 h-12 bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <span className="text-white font-medium">School Logo</span>
          </div>

          <div className="w-44 h-44 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full group-hover:scale-110 transition-transform duration-300" />
            <img
              src={owlMascot}
              alt="Owl mascot"
              className="w-full h-full object-contain relative z-10 drop-shadow-xl transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Welcome to PrepSOM!
            </h1>
            <p className="text-blue-600/80 max-w-sm leading-relaxed">
              Master concepts with interactive lessons, quick quizzes, and
              step-by-step solutions —tailored for your success!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-shake">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              className="w-full bg-white/80 border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-500 font-medium animate-slideDown">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                type={isShowPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                className="w-full bg-white/80 border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
              <div
                className="absolute right-0 top-0  h-full px-3 hover:bg-transparent"
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {isShowPassword ? <EyeIcon /> : <EyeOffIcon />}
              </div>
            </div>
            {fieldErrors.password && (
              <p className="text-sm text-red-500 font-medium animate-slideDown">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-6 text-lg font-medium rounded-xl shadow-lg shadow-blue-500/25 transform hover:scale-[1.02] transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg display={circleLoaderSvg} />
                Signing in...
              </span>
            ) : (
              "GET STARTED"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
