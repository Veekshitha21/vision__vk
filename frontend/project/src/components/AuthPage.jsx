import { useState } from "react";
import "./AuthPage.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtpMessage, setShowOtpMessage] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [regData, setRegData] = useState({
    name: "",
    phone: "",
    email: "",
    college: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // FOR SHOW/HIDE PASSWORDS
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirmPass, setShowRegConfirmPass] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setShowOtpMessage(false);

    setLoginData({ username: "", password: "" });

    setRegData({
      name: "",
      phone: "",
      email: "",
      college: "",
      address: "",
      password: "",
      confirmPassword: "",
    });

    setErrors({});
    setTouched({});
  };

  const validateField = (name, value) => {
    let message = "";

    if (value.trim() === "") {
      message = "This field is required";
    }

    if (name === "phone" && value) {
      if (!/^(\d{10}|\d{12})$/.test(value))
        message = "Phone number must be 10 or 12 digits";
    }

    if (name === "email" && value) {
      if (!value.endsWith("@gmail.com"))
        message = "Email must end with @gmail.com";
    }

    if (name === "password" && value) {
      if (value.length < 8) message = "Password must be at least 8 characters";
      else if (!/[A-Z]/.test(value))
        message = "Must contain at least 1 uppercase letter";
      else if (!/[a-z]/.test(value))
        message = "Must contain at least 1 lowercase letter";
      else if (!/[0-9]/.test(value))
        message = "Must contain at least 1 number";
      else if (!/[!@#$%^&*]/.test(value))
        message = "Must contain a special character";
    }

    if (name === "confirmPassword" && value) {
      if (value !== regData.password)
        message = "Passwords do not match";
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // LOGIN HANDLER
  const handleSubmitLogin = () => {
    let hasError = false;

    if (!loginData.username) {
      hasError = true;
      setErrors((prev) => ({ ...prev, username: "Username required" }));
      setTouched((prev) => ({ ...prev, username: true }));
    }

    if (!loginData.password) {
      hasError = true;
      setErrors((prev) => ({ ...prev, passwordLogin: "Password required" }));
      setTouched((prev) => ({ ...prev, passwordLogin: true }));
    }

    if (!hasError) alert("Login Successful!");
  };

  // REGISTRATION HANDLER
  const handleSubmitRegister = () => {
    const fields = [
      "name",
      "phone",
      "email",
      "college",
      "address",
      "password",
      "confirmPassword",
    ];

    let hasError = false;

    const newErrors = {};
    const newTouched = {};

    fields.forEach((field) => {
      newTouched[field] = true;

      if (!regData[field].trim()) {
        newErrors[field] = "This field is required";
        hasError = true;
      }
    });

    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (!hasError) {
      Object.keys(regData).forEach((key) =>
        validateField(key, regData[key])
      );
    }

    setTimeout(() => {
      if (Object.values(errors).every((e) => e === "")) {
        alert("Registered Successfully!");
      }
    }, 200);
  };

  const handleForgotPassword = () => {
    setShowOtpMessage(true);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {isLogin ? (
          <>
            {/* USERNAME */}
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="input-box"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                onBlur={handleBlur}
              />
              {touched.username && errors.username && (
                <p className="error">{errors.username}</p>
              )}
            </div>

            {/* LOGIN PASSWORD WITH EYE */}
            <div className="input-group">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={showLoginPass ? "text" : "password"}
                  name="passwordLogin"
                  placeholder="Enter your password"
                  className="input-box"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  onBlur={handleBlur}
                />

                <span
                  className="eye-icon"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                >
                  {showLoginPass ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>

              {touched.passwordLogin && errors.passwordLogin && (
                <p className="error">{errors.passwordLogin}</p>
              )}
            </div>

            <button className="btn" onClick={handleSubmitLogin}>
              Login
            </button>

            <p className="forgot-text" onClick={handleForgotPassword}>
              Forgot Password?
            </p>

            {showOtpMessage && (
              <p className="otp-message">
                An OTP has been sent to your registered email ID.
              </p>
            )}

            <p className="toggle-text">
              Not registered?{" "}
              <span className="link-text" onClick={toggleForm}>
                Register
              </span>
            </p>
          </>
        ) : (
          <>
            {/* BASIC FIELDS */}
            {["name", "phone", "email", "college", "address"].map((field) => (
              <div className="input-group" key={field}>
                <label>{field.replace(/^\w/, (c) => c.toUpperCase())}</label>
                <input
                  type="text"
                  name={field}
                  className="input-box"
                  placeholder={`Enter ${field}`}
                  value={regData[field]}
                  onChange={(e) =>
                    setRegData({ ...regData, [field]: e.target.value })
                  }
                  onBlur={handleBlur}
                />
                {touched[field] && errors[field] && (
                  <p className="error">{errors[field]}</p>
                )}
              </div>
            ))}

            {/* PASSWORD with EYE */}
            <div className="input-group">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={showRegPass ? "text" : "password"}
                  name="password"
                  className="input-box"
                  placeholder="Enter password"
                  value={regData.password}
                  onChange={(e) =>
                    setRegData({ ...regData, password: e.target.value })
                  }
                  onBlur={handleBlur}
                />

                <span
                  className="eye-icon"
                  onClick={() => setShowRegPass(!showRegPass)}
                >
                  {showRegPass ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>

              {touched.password && errors.password && (
                <p className="error">{errors.password}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD with EYE */}
            <div className="input-group">
              <label>Confirm Password</label>

              <div className="password-wrapper">
                <input
                  type={showRegConfirmPass ? "text" : "password"}
                  name="confirmPassword"
                  className="input-box"
                  placeholder="Re-enter password"
                  value={regData.confirmPassword}
                  onChange={(e) =>
                    setRegData({
                      ...regData,
                      confirmPassword: e.target.value,
                    })
                  }
                  onBlur={handleBlur}
                />

                <span
                  className="eye-icon"
                  onClick={() =>
                    setShowRegConfirmPass(!showRegConfirmPass)
                  }
                >
                  {showRegConfirmPass ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>

              {touched.confirmPassword && errors.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p>
              )}
            </div>

            <button className="btn" onClick={handleSubmitRegister}>
              Register
            </button>

            <p className="toggle-text">
              Already have an account?{" "}
              <span className="link-text" onClick={toggleForm}>
                Login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}