import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import MagicRings from "../../Backgrounds/MagicRings";


const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),

  email: z
    .string()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),

  phoneno: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
});

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState("password");
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const usernameValue = watch("username", "");
  const emailValue = watch("email", "");
  const passwordValue = watch("password", "");
  const phonenoValue = watch("phoneno", "");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        data,
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message);

      reset();

      navigate("/signin");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          "An error occurred. Please try again."
        );
      }
    }
  };

  const sendOtp = async () => {
    const email = watch("email");

    if (!email) {
      toast.error("Enter email first");
      return;
    }

    try {
      setIsSendingOtp(true);

      const response = await axios.post(
        "http://localhost:3000/api/auth/signup/send-otp",
        { email }
      );

      toast.success(response.data.message);

      setShowOtpField(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to send OTP"
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    const email = watch("email");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup/verify-otp",
        {
          email,
          otp,
        }
      );

      toast.success(response.data.message);

      setIsEmailVerified(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "OTP Verification Failed"
      );
    }
  };

  return (
    <div className=" min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-linear-to-br to-blue-950 via bg-zinc-950 z-0">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <MagicRings
          sensitivity={0.55}
          lineThickness={0.09}
          linesColor="#2F293A"
          gridScale={0.091}
          scanColor="#FF9FFC"
          scanOpacity={0.4}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
        />
      </div>

      {/* Card */}
      <div className="w-full max-w-md  bg-zinc-900/20 backdrop-blur-lg border border-zinc-400 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2">
          Sign Up
        </h1>

        <p className="text-zinc-400 mb-6">
          Create your account below.
        </p>
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>
            <label className="text-white block mb-2">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              {...register("username")}
              className={`w-full px-4 py-2 rounded-xl bg-zinc-800 text-white border outline-none ${errors.username
                ? "border-red-500"
                : "border-zinc-600"
                }`}
              value={usernameValue}
            />

            {errors.username && (
              <p className="text-red-400 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-white block mb-2">
              Email
            </label>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                {...register("email")}
                disabled={isEmailVerified}
                className={`flex-1 px-4 py-2 rounded-xl bg-zinc-800 text-white border outline-none ${errors.email
                  ? "border-red-500"
                  : "border-zinc-600"
                  }`}
              />

              {!isEmailVerified ? (
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={isSendingOtp}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSendingOtp
                    ? "Sending..."
                    : "Verify"}
                </button>
              ) : (
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-green-600 text-white"
                >
                  Verified ✓
                </button>
              )}
            </div>

            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          {showOtpField && !isEmailVerified && (
            <div>
              <label className="text-white block mb-2">
                Enter OTP
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                  placeholder="Enter OTP"
                  className="flex-1 px-4 py-2 rounded-xl bg-zinc-800 text-white border border-zinc-600 outline-none"
                />

                <button
                  type="button"
                  onClick={verifyOtp}
                  className="px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                >
                  Verify OTP
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="text-white block mb-2">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...register("password")}
              className={`w-full px-4 py-2 rounded-xl bg-zinc-800 text-white border outline-none ${errors.password
                ? "border-red-500"
                : "border-zinc-600"
                }`}
              value={passwordValue}
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-10 top-8/14 -translate-y-1/2cursor-pointer -translate-y-8/24 w-8 h-13 focus:outline-none text-zinc-400 hover:text-white"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-white block mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="Enter phone number"
              {...register("phoneno")}
              className={`w-full px-4 py-2 rounded-xl bg-zinc-800 text-white border outline-none ${errors.phoneno
                ? "border-red-500"
                : "border-zinc-600"
                }`}
              value={phonenoValue}
            />

            {errors.phoneno && (
              <p className="text-red-400 text-sm mt-1">
                {errors.phoneno.message}
              </p>
            )}
          </div>

          <div>
            <p className="text-zinc-400">
              Already have an account?{" "}
              <Link
                to="/Signin"
                className="text-blue-400 hover:text-blue-300"
              >
                Sign In
              </Link>
            </p>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-1/2 py-2 rounded-xl bg-zinc-800 text-white border border-zinc-600"
            >
              Reset
            </button>

            {/* <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 py-2 rounded-xl bg-white text-black font-semibold disabled:opacity-50"
            >
              {isSubmitting
                ? "Signing Up..."
                : "Sign Up"}
            </button> */}
            <button
              type="submit"
              disabled={!isEmailVerified || isSubmitting}
              className="w-1/2 py-2 rounded-xl bg-white text-black font-semibold disabled:opacity-50"
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;