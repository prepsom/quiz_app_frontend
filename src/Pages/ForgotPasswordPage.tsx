import { API_URL } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppContext } from "@/Context/AppContext";
import { AppContextType } from "@/types";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [emailSentTo, setEmailSentTo] = useState<string>("");

  const handleSendForgotPasswordEmail = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setIsEmailSent(false);
    if (email.trim() === "") {
      setError("Please enter an email");
      return;
    }
    try {
      // make api request to the backend which sends a email with the temporary password for the user to login and and make changes to the password
      setIsSubmitting(true);
      const response = await axios.post<{
        success: boolean;
        message: string;
        email: string;
      }>(`${API_URL}/user/forgot-password`, {
        email: email,
      });
      setEmail("");
      setIsEmailSent(true);
      setEmailSentTo(response.data.email);
    } catch (error: any) {
      setError(
        error.response
          ? error.response.data.message
          : "Failed to send email to user"
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
        <h1 className="text-xl text-blue-600 font-semibold mt-44">
          Forgot Password
        </h1>
        {!isEmailSent && (
          <div className="flex flex-col border-2 shadow-md px-4 py-4 border-gray-300 mt-8 w-3/4 mx-auto rounded-lg bg-white">
            <form
              onSubmit={(e) => handleSendForgotPasswordEmail(e)}
              className="flex flex-col items-center w-full gap-4"
            >
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="email">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
                  placeholder="example@example.com"
                />
              </div>
              {error !== "" && (
                <>
                  <div className="flex items-center justify-start p-2 bg-red-400 border-2 border-red-500 text-white font-semibold w-full rounded-lg">
                    {error}
                  </div>
                </>
              )}
              <Button
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white hover:bg-blue-600 hover:duration-300"
              >
                Send
              </Button>
            </form>
          </div>
        )}
        {isEmailSent && emailSentTo !== "" && (
          <div className="flex flex-col w-3/4 bg-white p-4 mx-auto items-center mt-8 rounded-lg shadow-md">
            <h1 className="text-gray-600 font-semibold">Reset email sent</h1>
            <p className="text-blue-500 font-semibold text-center mt-4 p-2 rounded-lg ">
              Please check your email at {emailSentTo.trim().toLowerCase()} and
              use the password reset link
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ForgotPasswordPage;
