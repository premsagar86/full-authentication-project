/* import React, { useRef, useState } from "react";
import { Mail } from "lucide-react";
import MagicRings from "../../Backgrounds/MagicRings";

const Verify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();

        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      alert("Please enter all 6 digits");
      return;
    }

    console.log("OTP:", code);

    // Call your verify API here
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-blue-950 to-zinc-950 z-0">
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

      <div className="w-full max-w-md bg-transparent rounded-2xl shadow-2xl p-8 border border-zinc-400 backdrop-blur-lg">
        <div className="flex justify-center mb-5">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
            <Mail className="text-violet-600" size={28} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-300">
          Verify Your Email
        </h2>

        <p className="text-center text-gray-400 mt-2">
          Please enter the verification code sent to your email.
        </p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mt-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500 border border-zinc-400 backdrop-blur-lg text-white bg-zinc-900/20"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify; */


import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import MagicRings from "../../Backgrounds/MagicRings";

// 1. Define the Zod validation schema
const verifySchema = z.object({
  otp: z
    .array(z.string())
    .length(6)
    .refine((arr) => arr.every((val) => val !== ""), {
      message: "Please enter all 6 digits of the verification code.",
    }),
});

const Verify = () => {
  const inputRefs = useRef([]);

  // 2. Initialize React Hook Form
  const {
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: ["", "", "", "", "", ""],
    },
  });

  // Watch the OTP array to trigger UI updates for the input fields
  const otpValues = watch("otp");

  // 3. Handle individual input changes
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // Only allow numbers

    const currentOtp = getValues("otp");
    const newOtp = [...currentOtp];
    newOtp[index] = value;
    
    // Update RHF state (shouldValidate ensures errors clear as they type)
    setValue("otp", newOtp, { shouldValidate: true });

    // Focus next input automatically
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 4. Handle backspace for easy editing
  const handleKeyDown = (e, index) => {
    const currentOtp = getValues("otp");

    if (e.key === "Backspace") {
      if (currentOtp[index]) {
        // Clear current input
        const newOtp = [...currentOtp];
        newOtp[index] = "";
        setValue("otp", newOtp, { shouldValidate: true });
      } else if (index > 0) {
        // Clear previous input and move focus back
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...currentOtp];
        newOtp[index - 1] = "";
        setValue("otp", newOtp, { shouldValidate: true });
      }
    }
  };

  // 5. Handle Copy/Paste logic
  const handlePaste = (e) => {
    e.preventDefault();

    // Get pasted data, strip non-numbers, limit to 6 digits
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = ["", "", "", "", "", ""];
    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setValue("otp", newOtp, { shouldValidate: true });

    // Move focus to the end of the pasted string
    const focusIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // 6. Handle Form Submission
  const onSubmit = async (data) => {
    // data.otp is guaranteed to be a fully populated 6-digit array thanks to Zod
    const code = data.otp.join("");
    console.log("Verified OTP:", code);

    try {
      // Add your API fetch/axios call here
      // await verifyEmailApi(code);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-blue-950 to-zinc-950 z-0">
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

      <div className="w-full max-w-md bg-transparent rounded-2xl shadow-2xl p-8 border border-zinc-400 backdrop-blur-lg">
        <div className="flex justify-center mb-5">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
            <Mail className="text-violet-600" size={28} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-300">
          Verify Your Email
        </h2>

        <p className="text-center text-gray-400 mt-2">
          Please enter the verification code sent to your email.
        </p>

        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <div
            className="flex justify-center gap-2 mt-8"
            onPaste={handlePaste}
          >
            {otpValues.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                inputMode="numeric"
                autoComplete="one-time-code"
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-12 h-12 text-center rounded-lg text-lg font-semibold border backdrop-blur-lg text-white bg-zinc-900/20 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
                  errors.otp ? "border-red-500" : "border-zinc-400"
                }`}
              />
            ))}
          </div>

          {/* RHF Error Message */}
          {errors.otp && (
            <p className="text-red-400 text-sm text-center mt-3 font-medium">
              {errors.otp.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-8 bg-violet-600 hover:bg-violet-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            {isSubmitting ? "Verifying..." : "Confirm"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;