import "./Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../../services/user-services";
import { userRegisterModel } from "../../models/user-models";

function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    const user: userRegisterModel = {
      email,
      name,
      position,
    };

    if (!name || !position || !email) {
      setError("Information invalid!!!");
      return;
    }
    setError("");
    try {
      const response = await userRegister(user);
      if (response.status === 201) {
        navigate("/auth", {
          state: { name, email },
        });
      }
    } catch (err) {
      setError("Failed to register");
      console.log(err);
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <h3>Please enter your information</h3>
        <input
          type="text"
          value={name}
          placeholder="Full name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <p>{error}</p>
        <button onClick={register}>Register</button>
      </div>
    </div>
  );
}

export default Register;
