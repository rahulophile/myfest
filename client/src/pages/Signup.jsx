import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TechBackground from "../components/TechBackground";

const Signup = () => {
  const [step, setStep] = useState(1); // 1 for details, 2 for OTP
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    mobileNumber: "",
    emailId: "",
    isGECVaishaliStudent: true,
    collegeName: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { requestSignupOTP, verifySignupOTPAndCreateUser } = useAuth();
  const navigate = useNavigate();
  const pageTopRef = useRef(null); // Ref for scrolling to top

  useEffect(() => {
    // Jab bhi step 2 (OTP) par aaye, page ko top par scroll karein
    if (step === 2 && pageTopRef.current) {
      pageTopRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [step]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError("Password must contain at least one special character");
      return false;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError("Password must contain at least one number");
      return false;
    }
    return true;
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const result = await requestSignupOTP(formData);
    if (result.success) {
      setServerOtp(result.otp);
      setStep(2);
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleVerifyAndCreateUser = async (e) => {
    e.preventDefault();
    if (otp !== serverOtp) {
      setError("Invalid OTP. Please check your email and try again.");
      return;
    }
    setLoading(true);
    const result = await verifySignupOTPAndCreateUser({ ...formData, otp });
    if (result.success) {
      setSuccess(
        "Account created! Your Vision ID has been emailed. Redirecting..."
      );
      setTimeout(() => navigate("/dashboard"), 3000);
    } else {
      setError(result.message);
      setStep(1);
    }
    setLoading(false);
  };

  return (
    <div
      ref={pageTopRef}
      className="relative min-h-screen flex items-center justify-center py-12 px-4"
    >
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
              {step === 1 ? "Create Account" : "Verify Your Email"}
            </h2>
            <p className="mt-2 text-gray-400">
              {step === 1
                ? "Join Vision Fest '25"
                : `An OTP has been sent to ${formData.emailId}`}
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <InputField
                id="name"
                name="name"
                type="text"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <InputField
                id="registrationNumber"
                name="registrationNumber"
                type="text"
                placeholder="Registration/Roll Number *"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                required
              />
              <InputField
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                placeholder="10-Digit Mobile Number *"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                maxLength="10"
                required
              />
              <InputField
                id="emailId"
                name="emailId"
                type="email"
                placeholder="Email ID *"
                value={formData.emailId}
                onChange={handleInputChange}
                required
              />
              <div className="flex items-center">
                <input
                  id="isGECVaishaliStudent"
                  name="isGECVaishaliStudent"
                  type="checkbox"
                  checked={formData.isGECVaishaliStudent}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-600 rounded bg-gray-700/50"
                />
                <label
                  htmlFor="isGECVaishaliStudent"
                  className="ml-2 block text-sm text-gray-300"
                >
                  GEC Vaishali Student?
                </label>
              </div>
              {!formData.isGECVaishaliStudent && (
                <InputField
                  id="collegeName"
                  name="collegeName"
                  type="text"
                  placeholder="College Name *"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  required
                />
              )}
              <PasswordField
                placeholder="Password *"
                value={formData.password}
                onChange={handleInputChange}
                name="password"
                show={showPassword}
                toggleShow={() => setShowPassword(!showPassword)}
              />
              <PasswordField
                placeholder="Confirm Password *"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                name="confirmPassword"
                show={showConfirmPassword}
                toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 font-semibold rounded-md text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
              >
                {loading ? <SpinnerIcon /> : "Get OTP & Verify"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndCreateUser} className="space-y-4">
              <InputField
                id="otp"
                name="otp"
                type="text"
                placeholder="Enter 6-Digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 font-semibold rounded-md text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
              >
                {loading ? <SpinnerIcon /> : "Create Account"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError("");
                  setSuccess("");
                }}
                className="w-full text-center text-sm text-cyan-400 hover:text-cyan-300"
              >
                Back to Details
              </button>
            </form>
          )}
          <p className="text-center text-sm text-gray-400 pt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-cyan-400 hover:text-cyan-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const InputField = (props) => (
  <input
    {...props}
    className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
  />
);
const PasswordField = ({
  placeholder,
  value,
  onChange,
  name,
  show,
  toggleShow,
}) => (
  <div className="relative">
    <InputField
      type={show ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      required
      className="pr-10"
    />
    <button
      type="button"
      onClick={toggleShow}
      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cyan-400"
    >
      {show ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  </div>
);
const SpinnerIcon = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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

export default Signup;
