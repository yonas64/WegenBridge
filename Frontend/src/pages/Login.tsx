import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FormEvent } from "react";
import { Heart, Shield, AlertCircle, Lock, Mail, Eye, EyeOff, UserPlus } from "lucide-react";
import { logError, logEvent } from "../utils/siemLogger";
import { apiUrl } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const [showPassword, setShowPassword] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(
        apiUrl("/api/auth/login"),
        {
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe, // 👈 pass to backend
        },
        {
          withCredentials: true, // ⭐ VERY IMPORTANT
        }
      );

  
      logEvent("auth_login_success", undefined, { email: formData.email });
      navigate("/");

    } catch (error) {
      logError("auth_login_failed", "Invalid email or password", { email: formData.email });
      console.error("Login failed", error);
      alert("Invalid email or password");
    }
  };

  useEffect(() => {
    const clientId = googleClientId;
    if (!clientId) {
      console.warn("VITE_GOOGLE_CLIENT_ID is not set");
      return;
    }

    let initialized = false;
    let interval: number | undefined;
    const initialize = () => {
      if (initialized) return;
      const google = (window as any).google;
      if (!google || !googleButtonRef.current) return;

      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          try {
            await axios.post(
              apiUrl("/api/auth/google"),
              {
                idToken: response.credential,
                rememberMe: formData.rememberMe,
              },
              { withCredentials: true }
            );
            logEvent("auth_google_login_success");
            navigate("/");
          } catch (error: any) {
            logError("auth_google_login_failed", error?.message || "Google login failed");
            alert("Google login failed");
          }
        },
      });

      google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: "360",
      });
      initialized = true;
    };

    initialize();
    interval = window.setInterval(() => {
      if ((window as any).google && googleButtonRef.current) {
        initialize();
        if (interval) window.clearInterval(interval);
      }
    }, 300);

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [formData.rememberMe, navigate]);

const handleChange = (e: any) => {
  const { name, value, type, checked } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        {/* Left side - Illustration/Info */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 lg:p-12 hidden lg:flex flex-col justify-center">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center mb-8">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <Heart className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Family Reconnection</h1>
                <p className="text-blue-100 text-lg mt-2">Bringing families together</p>
              </div>
            </div>

            <div className="space-y-6 mt-12">
              <div className="flex items-start">
                <div className="bg-white/20 p-2 rounded-lg mr-4 mt-1">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Secure Access</h3>
                  <p className="text-blue-100 mt-1">Your data is protected with enterprise-grade security</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white/20 p-2 rounded-lg mr-4 mt-1">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Help Reunite Families</h3>
                  <p className="text-blue-100 mt-1">Join thousands helping families find their loved ones</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <p className="italic text-blue-100">"Because of this platform, I found my brother after 2 years of searching. Every login brings hope to someone."</p>
              <p className="mt-4 font-semibold">— Sarah Johnson, Reunited Family Member</p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 lg:hidden">
              <div className="inline-flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mr-3">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Family Reconnect</h1>
              </div>
              <p className="text-gray-600">Sign in to continue helping families</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
                  <Lock className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Address
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="you@example.com"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Password
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Sign In
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  {googleClientId ? (
                    <div ref={googleButtonRef} />
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 px-4 border border-gray-300 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                    >
                      Google sign-in unavailable
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link 
                    to="/register" 
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center mt-2"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign up for free
                  </Link>
                </p>
                <p className="text-gray-600 mt-2">
                  Need admin access?{" "}
                  <Link
                    to="/register-admin"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Register as admin
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>By signing in, you agree to our <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.</p>
              <p className="mt-2 flex items-center justify-center">
                <Shield className="h-4 w-4 mr-1" />
                Your data is protected and confidential
              </p>
            </div>

            {/* Emergency notice for mobile */}
            <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 lg:hidden">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-sm font-medium text-gray-900">Emergency?</p>
              </div>
              <p className="text-sm text-gray-700 mt-1">
                Call our 24/7 hotline: <span className="font-bold text-red-600">0800-FIND-HOPE</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
