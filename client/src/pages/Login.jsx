import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TechBackground from "../components/TechBackground";

const Login = () => {
  // Login form states
  const [formData, setFormData] = useState({ emailId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Enter Email, 2: Enter OTP & New Pass
  const [forgotData, setForgotData] = useState({
    emailId: "",
    otp: "",
    newPassword: "",
  });
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotResult, setForgotResult] = useState(null);

  const {
    loginUser,
    requestForgotPasswordOTP,
    verifyForgotPasswordOTPAndReset,
  } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };
  const handleForgotInputChange = (e) => {
    setForgotData({ ...forgotData, [e.target.name]: e.target.value });
    setForgotResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await loginUser(formData.emailId, formData.password);
      if (result.success) navigate("/dashboard");
      else setError(result.message);
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotResult(null);

    if (forgotStep === 1) {
      // Step 1: Request OTP
      const result = await requestForgotPasswordOTP(forgotData.emailId);
      if (result.success) {
        setForgotStep(2); // Move to OTP step on success
        setForgotResult({ success: true, message: result.message });
      } else {
        setForgotResult(result);
      }
    } else if (forgotStep === 2) {
      // Step 2: Verify OTP & Reset
      if (forgotData.newPassword.length < 8) {
        setForgotResult({
          success: false,
          message: "Password must be at least 8 characters.",
        });
        setForgotLoading(false);
        return;
      }
      const result = await verifyForgotPasswordOTPAndReset(
        forgotData.emailId,
        forgotData.otp,
        forgotData.newPassword
      );
      setForgotResult(result);
      if (result.success) {
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotResult(null); // Reset for next time
        }, 3000);
      }
    }
    setForgotLoading(false);
  };

  const openForgotModal = () => {
    setShowForgotModal(true);
    setForgotResult(null);
    setForgotData({ emailId: "", otp: "", newPassword: "" });
    setForgotStep(1); // Always start from step 1
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4">
      <TechBackground />
      <div className="relative z-10 max-w-md w-full">
        <div className="glass-card rounded-2xl p-8 border border-cyan-400/20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-900 via-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-cyan-400/50">
              <span
                className="text-white font-bold text-4xl code-font"
                style={{ textShadow: "0 0 10px rgba(10, 236, 234, 0.7)" }}
              >
                V
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white code-font">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-400">
              Authenticate to access Vision Fest '25
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              id="emailId"
              name="emailId"
              type="text"
              placeholder="Email ID or User ID"
              value={formData.emailId}
              onChange={handleInputChange}
              required
            />
            <PasswordField
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              show={showPassword}
              toggleShow={() => setShowPassword(!showPassword)}
              required
            />
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="flex items-center justify-end text-sm">
              <button
                type="button"
                onClick={openForgotModal}
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 font-semibold rounded-md text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
            >
              {loading ? <SpinnerIcon /> : "ACCESS DASHBOARD"}
            </button>
            <p className="text-center text-sm text-gray-400">
              No account yet?{" "}
              <Link
                to="/signup"
                className="font-medium text-cyan-400 hover:text-cyan-300"
              >
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-2xl p-6 max-w-md w-full border border-cyan-400/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Reset Password
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            {/* --- YAHAN FIX KIYA GAYA HAI --- */}
            {/* Message Area */}
            {forgotResult && (
              <div
                className={`p-3 rounded-md text-sm mb-4 ${
                  forgotResult.success
                    ? "bg-green-900/50 text-green-200"
                    : "bg-red-900/50 text-red-200"
                }`}
              >
                {forgotResult.message}
              </div>
            )}

            {/* Form Area - Ab yeh final success ke baad hide nahi hoga, balki doosra button dikhega */}
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              {forgotStep === 1 && (
                <>
                  <p className="text-sm text-gray-300">
                    Enter your registered email to receive an OTP.
                  </p>
                  <InputField
                    id="emailId"
                    name="emailId"
                    type="email"
                    placeholder="Enter your Email ID"
                    value={forgotData.emailId}
                    onChange={handleForgotInputChange}
                    required
                  />
                </>
              )}
              {forgotStep === 2 && (
                <>
                  <InputField
                    id="otp"
                    name="otp"
                    placeholder="6-Digit OTP from Email"
                    value={forgotData.otp}
                    onChange={handleForgotInputChange}
                    required
                  />
                  <PasswordField
                    placeholder="Enter New Password"
                    name="newPassword"
                    value={forgotData.newPassword}
                    onChange={handleForgotInputChange}
                    show={showPassword}
                    toggleShow={() => setShowPassword(!showPassword)}
                    required
                  />
                </>
              )}

              {/* Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 bg-gray-600/50 hover:bg-gray-700/50 text-white py-2 rounded-md text-sm"
                >
                  Cancel
                </button>
                {/* Submit button hamesha dikhega (jab tak final success na ho) */}
                {!(forgotResult?.success && forgotStep === 2) && (
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-md text-sm disabled:opacity-50"
                  >
                    {forgotLoading ? (
                      <SpinnerIcon />
                    ) : forgotStep === 1 ? (
                      "Get OTP"
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- BAAKI KE HELPER COMPONENTS BILKUL WAISE HI RAHENGE ---
const InputField = (props) => (
  <input
    {...props}
    className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
  />
);
const PasswordField = ({
  id,
  name,
  placeholder,
  value,
  onChange,
  show,
  toggleShow,
  required,
}) => (
  <div className="relative">
    {" "}
    <InputField
      id={id}
      name={name}
      type={show ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="pr-10"
    />{" "}
    <button
      type="button"
      onClick={toggleShow}
      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cyan-400"
    >
      {show ? <EyeOffIcon /> : <EyeIcon />}
    </button>{" "}
  </div>
);
const SpinnerIcon = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
);
const EyeIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);
const EyeOffIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
);

export default Login;
