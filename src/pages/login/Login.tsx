import "./Login.css";
import {useEffect, useState} from "react";
import {userLogin, verifyToken} from "../../services/user-services";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const toRegister = () => {
    navigate("/register");
  };
  const handleLogin = async () => {
    if (!email) {
      setError("Email is required !!!");
      return;
    }
    setError("");
    try {
      const response = await userLogin(email);
      if (response.status === 200) {
        navigate("/auth", { state: { email } });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 404) {
        setError("User not found. Please sign up.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
      console.error("Login failed:", error);
    }
  };
  const tokenCheck = async () => {
      try{
        const response = await verifyToken();
        if (response.status === 200) {
          navigate("/board")
        }
        return;
      }catch(error: unknown) {
        console.error("Verify token failed:", error);
      }
  }
  useEffect(() => {
    tokenCheck();}
  , []);
  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome to Mini Trello</h1>
        <p>Please log in to continue.</p>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="error-message">{error}</p>

        <button onClick={handleLogin}>Log In</button>
        <button onClick={toRegister}>Register</button>
      </div>
    </div>
  );
}

export default Login;
