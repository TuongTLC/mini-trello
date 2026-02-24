import "./auth.css";
import { useState } from "react";
import { AxiosError } from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { userAuth } from "../../services/user-services";

function Auth() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const authState = (state || {}) as { email?: string };

  const [error, setError] = useState("");
  const [email] = useState(authState.email || "");
  const [otpCode, setOtpCode] = useState("");

  if (!authState.email) {
    return <Navigate to="/" replace />;
  }

  const user = {
    email,
    otp: otpCode,
  };

  const sendVerifyCode = async () => {
    if (!otpCode) {
      setError("Please enter otp code!!!");
      return;
    }
    try {
      const response = await userAuth(user);
      if (response.status === 200) {
        navigate("/board" );
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        setError("Otp code invalid!");
      }
      console.log(error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Account verification</h1>
        <h2>{authState.email}</h2>
        <p>Please enter the code sent to your email</p>
        <input
          type="text"
          placeholder="Authentication Code"
          onChange={(e) => setOtpCode(e.target.value)}
        />
        <br />
        <p>{error}</p>
        <button onClick={sendVerifyCode}>Verify</button>
      </div>
    </div>
  );
}

export default Auth;
