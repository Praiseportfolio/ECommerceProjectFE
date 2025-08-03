import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();
  const { sendOtp, verifyLoginOtp, loading, error } = useAuthActions();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setLocalError("Please enter your email address");
      return;
    }

    try {
      setIsLoading(true);
      await sendOtp(email, true);
      setStep("otp");
    } catch {
      // error is handled in the hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setLocalError("Please enter the verification code");
      return;
    }

    try {
      setIsLoading(true);
      const success = await verifyLoginOtp({ email, otp });
      if (success) {
        navigate("/");
      }
    } catch {
      // error already handled
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtp("");
    setLocalError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            {step === "email"
              ? "Enter your email to continue"
              : "Enter the verification code sent to your email"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step === "email"
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-600 text-white"
              }`}
            >
              <Mail className="w-4 h-4" />
            </div>
            <div
              className={`h-0.5 w-8 ${
                step === "otp" ? "bg-indigo-600" : "bg-gray-300"
              }`}
            />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step === "otp"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-400 border-gray-300"
              }`}
            >
              <Check className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {step === "email" ? (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {(localError || error) && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {localError || error}
                </div>
              )}

              <button
                type="button"
                onClick={handleEmailSubmit}
                disabled={isLoading || loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading || loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <div className="text-center text-sm text-gray-500">
                No account?{" "}
                <Link
                  to="/registration"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Sign up
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Verification Code
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-lg text-center tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Code sent to <span className="font-medium">{email}</span>
                </p>
              </div>

              {(localError || error) && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {localError || error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleOtpSubmit}
                  disabled={isLoading || loading}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading || loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Login</span>
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:ring-2 focus:ring-gray-500"
                >
                  Back to Email
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                  onClick={() =>
                    alert("Resend functionality would be implemented here")
                  }
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
