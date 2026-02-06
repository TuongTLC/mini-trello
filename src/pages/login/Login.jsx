import "./Login.css";
import { useState } from "react";
import {userLogin} from "../../services/user-services.ts";
import {useNavigate} from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toRegister = () => {
    navigate("/register");
  }
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
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("User not found. Please sign up.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
      console.error("Login failed:", error);
    }
  };
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
