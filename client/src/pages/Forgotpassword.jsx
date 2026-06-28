import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import MagicRings from "../../Backgrounds/MagicRings";
import axios from "axios";
import toast from "react-hot-toast";

// ✅ Dynamic validation schema
const getSchema = (step) => {
  if (step === "email") {
    return z.object({
      email: z.string().email({ message: "Invalid email address" }),
    });
  }

  if (step === "otp") {
    return z.object({
      otp: z
        .string()
        .length(4, { message: "OTP must be 4 digits" })
        .regex(/^[0-9]+$/, "Only numbers allowed"),
    });
  }

  return z.object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
    /* .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[0-9]/, "Must include at least one number"), */
  });
};

const Forgotpassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [savedEmail, setSavedEmail] = useState("");

  const getSchema = (step) => {
    // STEP 1 → EMAIL
    if (step === "email") { return z.object({ email: z.string().email({ message: "Invalid email address" }), }); }
    // STEP 2 → OTP 
    if (step === "otp") { return z.object({ otp: z.string().length(6, { message: "OTP must be 6 digits" }).regex(/^[0-9]+$/, "Only numbers allowed"), }); }
    // STEP 3 → PASSWORD
    return z.object({ password: z.string().min(8, { message: "Password must be at least 8 characters" }), });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(getSchema(step)),
  });


  // ✅ Reset form when step changes
  useEffect(() => {
    reset();
  }, [step, reset]);

  const onSubmit = async (data) => {
    try {
      // 🔹 STEP 1 → SEND OTP
      if (step === "email") {
        const response = await axios.post(
          "http://localhost:3000/api/auth/forgot-password",
          { email: data.email },
          { withCredentials: true }
        );

        toast.success(response.data.message);
        setSavedEmail(data.email);
        setStep("otp");
      }

      // 🔹 STEP 2 → VERIFY OTP
      else if (step === "otp") {
        const response = await axios.post(
          "http://localhost:3000/api/auth/verify-otp",
          {
            email: savedEmail,
            otp: data.otp,
          },
          { withCredentials: true }
        );

        toast.success(response.data.message);
        setStep("password");
      }

      // 🔹 STEP 3 → RESET PASSWORD
      else if (step === "password") {
        const response = await axios.post(
          "http://localhost:3000/api/auth/reset-password",
          {
            email: savedEmail,
            password: data.password,
          },
          { withCredentials: true }
        );

        toast.success(response.data.message);
        navigate("/signin");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-linear-to-br to-blue-950 via bg-zinc-950 z-0">

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <MagicRings
          sensitivity={0.55}
          lineThickness={0.1}
          linesColor="#8F293A"
          gridScale={5}
          scanColor="#F99FFC"
          scanOpacity={0.4}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
        />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-8 shadow-2xl">

        <h1 className="text-white text-3xl font-bold mb-4">
          Forgot Password
        </h1>

        <p className="text-zinc-400 mb-6">
          Reset your password securely
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* EMAIL STEP */}
          {step === "email" && (
            <div>
              <input
                type="text"
                placeholder="Enter your email"
                {...register("email")}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-600"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter OTP"
                {...register("otp")}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-600"
              />
              {errors.otp && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.otp.message}
                </p>
              )}
            </div>
          )}

          {/* PASSWORD STEP */}
          {step === "password" && (
            <div>
              <input
                type="password"
                placeholder="New Password"
                {...register("password")}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-600"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

          {/* BUTTON */}
          <button
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold disabled:opacity-50"
          >
            {step === "email"
              ? (isSubmitting ? "Sending OTP..." : "Send OTP")
              : step === "otp"
                ? "Verifying OTP"
                : isSubmitting
                  ? "Updating Password..."
                  : "Update Password"}
          </button>

          {/* BACK LINK */}
          <Link to="/signin" className="text-blue-400 text-sm block text-center">
            Back to Sign In
          </Link>

        </form>
      </div>
    </div>
  );
};

export default Forgotpassword;