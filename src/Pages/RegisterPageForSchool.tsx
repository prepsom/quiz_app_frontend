import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { validatePassword } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { useContext, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import owlMascot from "../assets/owl_image.png";
import { Alert, AlertDescription } from "@/components/ui/alert";
import circleLoaderSvg from "../assets/circleLoader.svg";
import axios from "axios";
import { API_URL } from "@/App";
import { AppContext } from "@/Context/AppContext";
import { AppContextType, RegisterResponse } from "@/types";

const GRADES = [6, 7, 8, 9, 10, 11, 12];

const schoolAndTheirAvailableGrades = new Map<string, number[]>([
  ["Radiant group tuitions", [8, 9]],
  ["Radha Krishna Educational Institute", [10]],
  ["PrepSOM School", [8, 9, 10]],
]);

const registerFormSchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(3, "name should have atleast 3 characters"),
    grade: z.string().refine((grade) => GRADES.includes(Number(grade)), {
      message: "please select a valid grade",
    }),
    phoneNumber: z
      .number()
      .refine((phoneNumber) => phoneNumber.toString().length === 10, {
        message: "phone number should be of length 10",
      }),
    password: z
      .string()
      .min(6, "password should have atleast 6 characters")
      .refine((password) => validatePassword(password), {
        message:
          "Password should have at least 1 special character, 1 numerical character, and 1 uppercase character",
      }),
    confirmPassword: z.string(),
  })
  .refine((form) => form.password === form.confirmPassword, {
    message: "passwords do not match",
  });

type registerFormType = z.infer<typeof registerFormSchema>;

const RegisterPageForSchool = () => {
  const navigate = useNavigate();
  const { schoolName } = useParams<{ schoolName: string }>();
  const { school, isLoading: isSchoolLoading } = useGetSchool(schoolName);
  const { setLoggedInUser, loggedInUser } = useContext(
    AppContext
  ) as AppContextType;
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const AVAILABLE_GRADES_FOR_SCHOOL = schoolAndTheirAvailableGrades.get(
    school ? school.schoolName : ""
  );

  console.log(schoolName);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<registerFormType>({ resolver: zodResolver(registerFormSchema) });

  const onSubmit: SubmitHandler<registerFormType> = async (data) => {
    console.log(data);
    try {
      setIsLoading(true);
      const { email, grade, name, password, phoneNumber } = data;
      const gradeNumber = parseInt(grade);
      if (school === null) return;
      const response = await axios.post<RegisterResponse>(
        `${API_URL}/auth/register`,
        {
          email,
          password,
          name,
          grade: gradeNumber,
          phoneNumber,
          schoolName,
          schoolId: school?.id,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setLoggedInUser(response.data.user);
      navigate("/");
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (loggedInUser !== null) {
    return <Navigate to="/" />;
  }

  if (!schoolName) {
    return <Navigate to="/register" />;
  }

  if (isSchoolLoading) {
    return (
      <>
        <div className="flex items-center justify-center mt-14">
          <Loader />
        </div>
      </>
    );
  }

  if (!isSchoolLoading && !school) {
    return (
      <>
        <div className="flex flex-col items-center justify-center mt-32 gap-4 border-2 border-gray-400 rounded-lg shadow-md p-4">
          <span className="text-xl text-red-500">Invalid school name</span>
          <Button variant="outline">Register with prepsom</Button>
        </div>
      </>
    );
  }

  if (
    !AVAILABLE_GRADES_FOR_SCHOOL ||
    AVAILABLE_GRADES_FOR_SCHOOL.length === 0
  ) {
    return (
      <>
        <div>No Available grades for school.please visit later</div>
      </>
    );
  }

  return (
    <>
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
                                AVAILABLE_GRADES_FOR_SCHOOL.includes(
                                  gradeNumber
                                )
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
              <div className="relative">
                <Input
                  type={isShowConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  className="w-full bg-white/80 border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
                <div
                  className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent cursor-pointer flex items-center"
                  onClick={() =>
                    setIsShowConfirmPassword(!isShowConfirmPassword)
                  }
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
    </>
  );
};

export default RegisterPageForSchool;
