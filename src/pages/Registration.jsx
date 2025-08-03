import { useState } from "react";
import { Mail, ArrowRight, Check, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthActions } from "../hooks/useAuth";

export default function RegistrationPage() {
  const [step, setStep] = useState("register"); // 'register' or 'otp'
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const { submitRegister, sendOtp, loading, error } = useAuthActions();
  const navigate = useNavigate();

  const handleRegistrationSubmit = async () => {
    if (!fullName.trim()) {
      alert("Please enter your full name");
      return;
    } else if (!email.trim()) {
      alert("Please enter your email address");
      return;
    } else {
      await sendOtp(email, false);
      setStep("otp");
    }
  };

  const handleOtpVerification = async () => {
    if (!otp) {
      alert("Please enter the verification code");
      return;
    }

    try {
      await submitRegister({ fullName, email, otp });
      navigate("/login");
    } catch {
      // Error is already handled in hook
    }
  };

  const handleBackToRegistration = () => {
    setStep("register");
    setOtp("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            {step === "register"
              ? "Fill in your details to get started"
              : "Enter the verification code sent to your email"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-indigo-600 bg-indigo-600 text-white">
              <User className="w-4 h-4" />
            </div>
            <div
              className={`h-0.5 w-8 ${
                step === "otp" ? "bg-indigo-600" : "bg-gray-300"
              }`}
            />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step === "otp"
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-gray-300 bg-white text-gray-400"
              }`}
            >
              <Check className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {step === "register" ? (
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-lg"
                    placeholder="Enter your full name"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-lg"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <button
                onClick={handleRegistrationSubmit}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Sign in
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-lg text-center tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Code sent to <span className="font-medium">{email}</span>
                </p>
              </div>

              {/* User Info */}
              <div className="bg-gray-50 p-4 rounded-lg border text-sm space-y-1">
                <p>
                  <strong>Name:</strong> {fullName}
                </p>
                <p>
                  <strong>Email:</strong> {email}
                </p>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Submit and Back */}
              <div className="space-y-3">
                <button
                  onClick={handleOtpVerification}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 flex justify-center items-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Create Account</span>
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </button>

                <button
                  onClick={handleBackToRegistration}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200"
                >
                  Back to Registration
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={() =>
                    alert("Resend functionality would be implemented here")
                  }
                  className="text-sm text-indigo-600 hover:text-indigo-500"
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
