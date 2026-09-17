import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white p-12 flex-col justify-between">
        <div>
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <Rocket size={28} />
            PrepAI
          </Link>

          <div className="mt-24 max-w-lg">
            <p className="text-blue-200 font-medium mb-3">
              🚀 Start your interview journey
            </p>

            <h1 className="text-5xl font-bold leading-tight">
              Your dream job
              <br />
              starts here.
            </h1>

            <p className="mt-6 text-lg text-blue-100 leading-relaxed">
              Join PrepAI and practice smarter with AI-powered interview
              preparation designed for developers.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-green-300 mt-1" size={22} />

                <div>
                  <p className="font-semibold">Practice real questions</p>
                  <p className="text-blue-200">
                    Prepare for technical and HR interviews
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-green-300 mt-1" size={22} />

                <div>
                  <p className="font-semibold">AI-powered feedback</p>
                  <p className="text-blue-200">
                    Understand your strengths and weaknesses
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-green-300 mt-1" size={22} />

                <div>
                  <p className="font-semibold">Track your progress</p>
                  <p className="text-blue-200">
                    Watch your interview skills improve
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-blue-200 text-sm">
          © 2026 PrepAI. Built for ambitious developers.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold text-blue-700"
            >
              <Rocket size={26} />
              PrepAI
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Create your account 🚀
              </h2>

              <p className="mt-2 text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* TERMS */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-blue-600"
                />

                <p className="text-sm text-slate-500">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Terms & Conditions
                  </a>
                </p>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? "Creating account..." : "Create account →"}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-2 text-sm text-slate-400 justify-center">
              <Lock size={15} />
              Your information is securely encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
