import type React from "react";
import { useContext, useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AppContextType, RegisterResponse } from "@/types";
import { API_URL } from "@/App";
import { AppContext } from "@/Context/AppContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { validatePassword } from "@/utils";
import owlMascot from "../assets/owl_image.png";
import circleLoaderSvg from "../assets/circleLoader.svg";
import MaleAvatar from "../assets/MaleAvatar.jpeg";
import FemaleAvatar from "../assets/FemaleAvatar.jpeg";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetSchool } from "@/hooks/useGetSchool";

const RegisterFormSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    name: z.string().min(3, "Name should have at least 3 characters"),
    password: z
      .string()
      .min(6, "Password should have at least 6 characters")
      .refine((password) => validatePassword(password), {
        message:
          "Password should have at least 1 special character, 1 numerical character, and 1 uppercase character",
      }),
    confirmPassword: z.string(),
    grade: z.string().refine((grade) => GRADES.includes(Number(grade)), {
      message: "select a valid grade",
    }),
    schoolName: z.string().min(1, "school name required"),
    phoneNumber: z
      .number()
      .refine((phoneNumber) => phoneNumber.toString().length === 10, {
        message: "phone number should be of length 10",
      }),
   avatar: z.enum(["MALE", "FEMALE"], { message: "Select a valid avatar" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormType = z.infer<typeof RegisterFormSchema>;

const GRADES = [6, 7, 8, 9, 10, 11, 12];
const AVAILABLE_GRADES = [7, 8, 9, 10, 11];
const DEFAULT_SCHOOL_NAME = "PrepSOM School";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { school, isLoading: isSchoolLoading } =
    useGetSchool(DEFAULT_SCHOOL_NAME);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { loggedInUser, setLoggedInUser } = useContext(
    AppContext
  ) as AppContextType;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterFormSchema),
  });

  if (loggedInUser !== null) {
    return <Navigate to="/" />;
  }

  const onSubmit = async (data: RegisterFormType) => {
    setIsLoading(true);
    setError("");
    const { email, grade, password, name, schoolName, phoneNumber, avatar } = data;
    const gradeNumber = parseInt(grade);
    try {
      if (!school) return;
      const response = await axios.post<RegisterResponse>(
        `${API_URL}/auth/register`,
        {
          email,
          password,
          name,
          grade: gradeNumber,
          phoneNumber,
          avatar,
          schoolName,
          schoolId: school.id,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setLoggedInUser(response.data.user);
      localStorage.setItem("firstTimeLogin", "true");
      navigate("/");
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSchoolLoading) {
    return (
      <>
        <div className="flex items-center justify-center mt-28">
          <Loader />
        </div>
      </>
    );
  }

  if (!isSchoolLoading && !school) {
    return (
      <>
        <div className="flex items-center justify-center mt-28 border-2 border-400-gray rounded-lg p-4">
          Default PrepSOM school not found
        </div>
      </>
    );
  }

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
          <div className="w-44 h-44 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full group-hover:scale-110 transition-transform duration-300" />
            <img
              src={owlMascot || "/placeholder.svg"}
              alt="Owl mascot"
              className="w-full h-full object-contain relative z-10 drop-shadow-xl transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Join PrepSOM Today!
            </h1>
            <p className="text-blue-600/80 max-w-sm leading-relaxed">
              Create your account and start your journey to mastery with
              interactive lessons and personalized quizzes.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              {...register("email")}
              className="w-full bg-white/80 border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
            {errors.email && (
              <p className="text-sm text-red-500 font-medium animate-slideDown">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Full Name"
              {...register("name")}
              className="w-full bg-white/80 border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
            {errors.name && (
              <p className="text-sm text-red-500 font-medium animate-slideDown">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              name="grade"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Grades</SelectLabel>
                      {GRADES.map((gradeNumber: number) => {
                        return (
                          <SelectItem
                            disabled={
                              AVAILABLE_GRADES.includes(gradeNumber)
                                ? false
                                : true
                            }
                            value={`${gradeNumber}`}
                            key={gradeNumber}
                          >
                            {gradeNumber}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.grade && (
              <p className="text-sm text-red-500 font-medium animate-slideDown">
                {errors.grade.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="text"
              id="schoolName"
              {...register("schoolName")}
              placeholder="Enter school name"
            />
            {errors.schoolName && (
              <p className="text-red-500">{errors.schoolName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              id="phoneNumber"
              {...register("phoneNumber", { valueAsNumber: true })}
              placeholder="eg: 9136875390"
            />
            {errors.phoneNumber && (
              <p className="text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={isShowPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="w-full bg-white/80 border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
              <div
                className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent cursor-pointer flex items-center"
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {isShowPassword ? <EyeIcon /> : <EyeOffIcon />}
              </div>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 font-medium animate-slideDown">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              name="avatar"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an avatar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Avatar</SelectLabel>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          {errors.avatar && (
              <p className="text-sm text-red-500 font-medium animate-slideDown">
                {errors.avatar.message}
              </p>
            )}
          </div>


          {control._formValues.avatar && (
            <div className="flex justify-center mt-2">
              <img
                src={
                  control._formValues.avatar === "MALE"
                    ? MaleAvatar // or use import if require fails
                    : FemaleAvatar
                }
                alt="Selected Avatar"
                className="w-20 h-20 object-contain rounded-full border-2 border-blue-300 shadow-md"
              />
            </div>
          )}


          <div className="space-y-2">
            <div className="relative">
              <Input
                type={isShowConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className="w-full bg-white/80 border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
              <div
                className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent cursor-pointer flex items-center"
                onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              >
                {isShowConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 font-medium animate-slideDown">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-blue-600">Already have an account?</span>
            <Link
              className="text-blue-600 font-semibold hover:underline hover:underline-offset-2"
              to="/login"
            >
              Click here
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-6 text-lg font-medium rounded-xl shadow-lg shadow-blue-500/25 transform hover:scale-[1.02] transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg display={circleLoaderSvg} />
                Registering...
              </span>
            ) : (
              "CREATE ACCOUNT"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
