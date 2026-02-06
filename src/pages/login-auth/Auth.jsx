import "./auth.css";
import {Navigate, useLocation} from "react-router-dom";
import { useState} from "react";
import {userAuth} from "../../services/user-services.ts";
import {useNavigate} from "react-router-dom";

function Auth() {


    const navigate = useNavigate();
    const { state } = useLocation();

    const [error, setError] = useState("");
    const [email] = useState(state?.email || "");
    const [otpCode, setOtpCode] = useState("");

    if (!state?.email) {
        return <Navigate to="/" replace />;
    }

    let user ={
        email: email,
        otp: otpCode,
    }

    const sendVerifyCode = async () => {
            if (!otpCode){
                setError('Please enter otp code!!!');
                return;
            }
            try {
                const response = await userAuth(user);
                console.log(response);
                if (response.status === 200){
                    console.log("Navigating to /board");
                    navigate("/board");
                }
            }catch(err){
                if (err.status === 404){
                    setError('Otp code invalid!');
                }
                console.log(err)
            }
    }
    return (
    <div className="auth-page">
      <div className="auth-container">
          <h1>Account verification</h1>
          <h2>{state.email}</h2>
        <p>Please enter the code sent to your email</p>
        <input
            type="text"
            placeholder="Authentication Code"
            onChange={(e) => setOtpCode(e.target.value)} />
        <br />
          <p>{error}</p>
        <button onClick={sendVerifyCode}>Verify</button>
      </div>
    </div>
  );
}
export default Auth;
