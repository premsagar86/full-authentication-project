/* import MagicRings from "../../Backgrounds/MagicRings";
import React from "react";
import { useEffect} from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Signin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState("password");

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Check URL parameters when the component mounts
    const verified = searchParams.get("verified");
    const error = searchParams.get("error");

    if (verified === "true") {
      toast.success("Email verified successfully! You can now log in.");
      // Clean up the URL so the toast doesn't fire again on refresh
      setSearchParams({});
    }

    if (error === "invalid_token") {
      toast.error("The verification link is invalid or has already been used.");
      setSearchParams({});
    }

    if (error === "token_expired") {
      toast.error("Your verification link has expired. Please request a new one.");
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const verified = searchParams.get("verified");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        data,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      navigate("/home");
    }
    catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }

    }
    reset();
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-4 bg-linear-to-tr to-blue-950 via-zinc-950 from-blue-900 z-0 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <MagicRings
            sensitivity={0.55}
            lineThickness={1}
            linesColor="#2F293A"
            gridScale={0.091}
            scanColor="#FF9FFC"
            scanOpacity={0.4}
            enablePost
            bloomIntensity={0.6}
            chromaticAberration={0.002}
            noiseIntensity={0.01} />
        </div>
        <div className="w-full max-w-md bg-zinc-900/20 opacity-75 border border-zinc-400 rounded-2xl p-8 shadow-2xl">
          <div className="space-y-4 mb-10">
            <h1 className="text-white text-4xl font-bold mb-6">
              Sign In
            </h1>

            <p className="text-zinc-400 mb-10">
              Login below with your account
            </p>
          </div>
          {verified === "true" && (
            <div className="bg-green-500/10 border border-green-500 text-green-300 p-3 rounded mb-4">
              Email verified successfully.
              Please login.
            </div>
          )}
          {verified === "false" && (
            <div className="bg-green-500/10 border border-red-500 text-red-300 p-3 rounded mb-4">
              Please verify your email before logging in.
            </div>
          )}
          <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label className="text-white block mb-2">
                Email
              </label>

              <input
                type="text"
                {...register("email", {
                  required: "email is required",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: "Invalid email @ is missing",
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl bg-zinc-800 text-white outline-none border ${errors.email
                  ? "border-red-500"
                  : "border-zinc-600"
                  }`}
              />

              {errors.email && (
                <p className="text-red-400 mt-2 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

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
              
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-12 top-8/13.5 cursor-pointer -translate-y-8/74  w-8 h-13 focus:outline-none text-zinc-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>


              {errors.password && (
                <p className="text-red-400 mt-2 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-zinc-400 text-sm">
                Don't have an account?{" "}<Link className="text-blue-400 text-sm hover:text-amber-300" to="/signup">Sign Up</Link>
              </p>
              <p className="text-zinc-400 ">
                <Link className="text-blue-400 text-sm hover:text-amber-300" to="/forgot-password">Forgot password?</Link>
              </p>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="w-1/2 py-3 rounded-xl bg-white text-black font-semibold"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signin; */
import MagicRings from "../../Backgrounds/MagicRings";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Signin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const verified = searchParams.get("verified");
    const error = searchParams.get("error");

    if (verified === "true") {
      toast.success("Email verified successfully! You can now log in.");
      setSearchParams({});
    }

    if (error === "invalid_token") {
      toast.error(
        "The verification link is invalid or has already been used."
      );
      setSearchParams({});
    }

    if (error === "token_expired") {
      toast.error(
        "Your verification link has expired. Please request a new one."
      );
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const verified = searchParams.get("verified");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        data,
        { withCredentials: true }
      );

      toast.success(response.data.message);
      navigate("/home");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    }

    reset();
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-linear-to-tr to-blue-950 via-zinc-950 from-blue-900 relative overflow-hidden z-0 ">
      <div className="absolute inset-0 -z-10">
        <MagicRings
          sensitivity={0.55}
          lineThickness={1}
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

      <div className="w-full max-w-md bg-zinc-900/20 border border-zinc-400 rounded-2xl p-8 shadow-2xl">
        <div className="space-y-4 mb-10">
          <h1 className="text-white text-4xl font-bold">
            Sign In
          </h1>

          <p className="text-zinc-400">
            Login below with your account
          </p>
        </div>

        {verified === "true" && (
          <div className="bg-green-500/10 border border-green-500 text-green-300 p-3 rounded mb-4">
            Email verified successfully. Please login.
          </div>
        )}

        {verified === "false" && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 p-3 rounded mb-4">
            Please verify your email before logging in.
          </div>
        )}

        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Email */}
          <div>
            <label className="text-white block mb-2">
              Email
            </label>

            <input
              type="text"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
              className={`w-full px-4 py-3 rounded-xl bg-zinc-800 text-white outline-none border ${
                errors.email
                  ? "border-red-500"
                  : "border-zinc-600"
              }`}
            />

            {errors.email && (
              <p className="text-red-400 mt-2 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-white block mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                })}
                className={`w-full px-4 py-3 pr-12 rounded-xl bg-zinc-800 text-white border outline-none ${
                  errors.password
                    ? "border-red-500"
                    : "border-zinc-600"
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-950 hover:text-zinc-700 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-400 mt-2 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-zinc-400 text-sm">
              Don't have an account?{" "}
              <Link
                className="text-blue-400 hover:text-amber-300"
                to="/signup"
              >
                Sign Up
              </Link>
            </p>

            <Link
              className="text-blue-400 text-sm hover:text-amber-300"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-1/2 py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;