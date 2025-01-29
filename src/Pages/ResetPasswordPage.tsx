import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useContext, useState } from "react";
import { EyeIcon } from "lucide-react";
import { EyeOffIcon } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/App";
import { AppContext } from "@/Context/AppContext";
import { AppContextType } from "@/types";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState<string>("");
  const [isShowNewPassword, setIsShowNewPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResetPasswordSuccessfull, setIsResetPasswordSuccessfull] =
    useState<boolean>(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsResetPasswordSuccessfull(false);
    if (newPassword.trim() === "") {
      setError("please enter a password");
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      setError("Passwords do not match");
      return;
    }
    try {
      // validate password and confirm password
      // make api request with token to reset password only if the current datetime is less than the expiration datetime
      // `${API_URL}/user/reset-password , {token , newPassword}
      setIsSubmitting(true);
      const response = await axios.post(`${API_URL}/user/reset-password`, {
        newPassword: newPassword,
        token: token,
      });
      console.log(response);
      setIsResetPasswordSuccessfull(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.log(error);
      setError(
        error.response
          ? error.response.data.message
          : "Failed to reset password"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loggedInUser !== null) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-[#EEF6FF]">
        <h1 className="text-blue-600 mt-44 font-semibold text-xl">
          Reset Password
        </h1>
        {isResetPasswordSuccessfull === false && (
          <div className="flex flex-col items-center bg-white mt-8 rounded-lg shadow-md px-4 py-4 w-3/4 mx-auto">
            <form
              onSubmit={(e) => handleResetPassword(e)}
              className="flex flex-col items-center w-full gap-4"
            >
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type={isShowNewPassword ? "text" : "password"}
                    id="newPassword"
                  />
                  <div
                    onClick={() => setIsShowNewPassword(!isShowNewPassword)}
                    className="absolute top-0 right-0 pt-1 pr-2"
                  >
                    {!isShowNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="confirmPassword"
                    type={isShowConfirmPassword ? "text" : "password"}
                  />
                  <div
                    onClick={() =>
                      setIsShowConfirmPassword(!isShowConfirmPassword)
                    }
                    className="absolute top-0 right-0 pt-1 pr-2"
                  >
                    {isShowConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </div>
                </div>
              </div>
              {error !== "" && (
                <>
                  <div className="w-full p-2 bg-red-400  border-2 border-red-500 rounded-lg text-white font-semibold">
                    {error}
                  </div>
                </>
              )}
              <Button
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white hover:bg-blue-600 hover:duration-300"
              >
                Reset Password
              </Button>
            </form>
          </div>
        )}
        {isResetPasswordSuccessfull && (
          <div className="mt-4 bg-white flex flex-col gap-4 items-center w-3/4 p-4 mx-auto rounded-lg shadow-md">
            <h1 className="text-gray-600 font-semibold text-xl">
              Password reset successfull
            </h1>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-500 text-white hover:bg-blue-600 hover:duration-300"
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ResetPasswordPage;
