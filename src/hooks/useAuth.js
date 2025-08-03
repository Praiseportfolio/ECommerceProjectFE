import { useState } from "react";
import { useAuth } from "../store/AuthContext";

export function useAuthActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const submitRegister = async ({ fullName, email, otp }) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5454/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, otp }),
      });

      if (!res.ok) throw new Error("Registration failed");

      const data = await res.json();
      login(data); // contains { user, jwt }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (email, isLoginFlow) => {
  setLoading(true);
  setError("");

  try {
    const res = await fetch("http://localhost:5454/api/auth/sent/login-signup-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, isLoginFlow }),
    });

    if (!res.ok) throw new Error("Failed to send verification code");
  } catch (err) {
    setError(err.message);
    throw err; // So UI can catch it if needed
  } finally {
    setLoading(false);
  }
};

// const verifyLoginOtp = async ({ email, otp }) => {
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch("http://localhost:5454/api/auth/signin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       if (!res.ok) throw new Error("Invalid OTP or login failed");

//       const data = await res.json();
//       setToken(data.token);      // optional: store in context or localStorage
//       setUser(data.user);        // if available
//       return true;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

  const verifyLoginOtp = async ({ email, otp }) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5454/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      login(data);
      return true;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { submitRegister, sendOtp, verifyLoginOtp, loading, error };
}