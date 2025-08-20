import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ emailId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotType, setForgotType] = useState("userid");
  const [forgotData, setForgotData] = useState({
    registrationNumber: "",
    emailId: "",
    userId: "",
  });
  const [forgotResult, setForgotResult] = useState(null);

  const { loginUser, forgotUserId, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleForgotInputChange = (e) => {
    setForgotData({ ...forgotData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await loginUser(formData.emailId, formData.password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setForgotResult(null);
    try {
      let result;
      if (forgotType === "userid") {
        result = await forgotUserId(
          forgotData.registrationNumber,
          forgotData.emailId
        );
      } else {
        result = await forgotPassword(forgotData.userId);
      }
      setForgotResult(result);
    } catch (error) {
      setForgotResult({
        success: false,
        message: "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You might want a better notification system than alert
    alert("Copied to clipboard!");
  };

  const openForgotModal = (type) => {
    setForgotType(type);
    setShowForgotModal(true);
    setForgotResult(null);
    setForgotData({ registrationNumber: "", emailId: "", userId: "" });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="glass-card rounded-2xl p-8 border border-cyan-400/20 shadow-2xl shadow-cyan-500/10">
          {/* Header */}
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

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <InputField
                id="emailId"
                name="emailId"
                type="email"
                placeholder="Email ID"
                value={formData.emailId}
                onChange={handleInputChange}
              />
              <InputField
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => openForgotModal("password")}
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot Password?
              </button>
              <button
                type="button"
                onClick={() => openForgotModal("userid")}
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot User ID?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "ACCESS DASHBOARD"
              )}
            </button>

            <p className="text-center text-sm text-gray-400">
              No account yet?{" "}
              <Link
                to="/signup"
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Forgot Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-2xl p-6 max-w-md w-full border border-cyan-400/30">
            {/* ... Modal content remains the same, but will inherit the techie feel */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                {forgotType === "userid" ? "Recover User ID" : "Reset Password"}
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {!forgotResult ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                {forgotType === "userid" ? (
                  <>
                    <InputField
                      id="registrationNumber"
                      name="registrationNumber"
                      type="text"
                      placeholder="Enter Registration Number"
                      value={forgotData.registrationNumber}
                      onChange={handleForgotInputChange}
                      required
                    />
                    <InputField
                      id="emailId"
                      name="emailId"
                      type="email"
                      placeholder="Enter Registered Email ID"
                      value={forgotData.emailId}
                      onChange={handleForgotInputChange}
                      required
                    />
                  </>
                ) : (
                  <InputField
                    id="userId"
                    name="userId"
                    type="text"
                    placeholder="Enter your VZN25 User ID"
                    value={forgotData.userId}
                    onChange={handleForgotInputChange}
                    required
                  />
                )}
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 bg-gray-600/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {forgotResult.success ? (
                  <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-md">
                    <p className="font-medium mb-2">
                      {forgotType === "userid"
                        ? "User ID Found!"
                        : "Password Reset Info"}
                    </p>
                    {forgotType === "userid" ? (
                      <div>
                        <p className="mb-2">
                          Your User ID:{" "}
                          <span className="font-mono bg-gray-700/50 px-2 py-1 rounded">
                            {forgotResult.data.userId}
                          </span>
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(forgotResult.data.userId)
                          }
                          className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-sm mt-2"
                        >
                          Copy User ID
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-2">
                          {forgotResult.data.newPassword
                            ? "Your new password is:"
                            : "Password reset instructions have been sent."}
                        </p>
                        {forgotResult.data.newPassword && (
                          <p className="font-mono text-lg font-bold bg-gray-700/50 px-2 py-1 rounded">
                            {forgotResult.data.newPassword}
                          </p>
                        )}
                        {forgotResult.data.note && (
                          <p className="text-xs mt-2 text-blue-300">
                            {forgotResult.data.note}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md">
                    {forgotResult.message}
                  </div>
                )}
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full bg-gray-600/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Input Field component for a consistent tech look
const InputField = ({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  required = false,
}) => (
  <div>
    <label htmlFor={id} className="sr-only">
      {placeholder}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
      placeholder={placeholder}
    />
  </div>
);

export default Login;
