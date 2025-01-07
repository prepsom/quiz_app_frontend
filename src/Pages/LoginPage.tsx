"use client";

import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AppContextType, LoginRequest, LoginResponse } from "@/types";
import { API_URL } from "@/App";
import { AppContext } from "@/Context/AppContext";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import owlMascot from "../assets/owl_image.png";

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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-8 bg-white/80 shadow-xl rounded-2xl border-0">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-12 bg-blue-500 flex items-center justify-center rounded-xl shadow-sm">
            <span className="text-white font-medium">School Logo</span>
          </div>

          <div className="w-44 h-44 relative">
            <img
              src={owlMascot}
              alt="Owl mascot"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-center text-blue-600">
            Welcome to PrepSOM!
          </h1>
          <p className="text-center text-blue-600/80 max-w-sm">
            Master concepts with interactive lessons, quick quizzes, and
            step-by-step solutions —tailored for your success!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
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
              className="w-full bg-white/80 border-blue-100 focus:border-blue-500"
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-500 font-medium">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type={isShowPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              className="w-full bg-white/80 border-blue-100 focus:border-blue-500"
            />
            {fieldErrors.password && (
              <p className="text-sm text-red-500 font-medium">
                {fieldErrors.password}
              </p>
            )}
            <div className="flex items-center gap-2 text-blue-600">
              <Checkbox
                id="showPassword"
                checked={isShowPassword}
                onCheckedChange={() => setIsShowPassword(!isShowPassword)}
                className="border-blue-200 data-[state=checked]:bg-blue-500"
              />
              <label htmlFor="showPassword" className="text-sm cursor-pointer">
                {isShowPassword ? "Hide password" : "Show password"}
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg font-medium rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "GET STARTED"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
