import "./auth.css";
function Auth() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Authenticate Your Account</h1>
        <p>Please enter the code sent to your email.</p>
        <input type="text" placeholder="Authentication Code" />
        <br />
        <button>Verify</button>
      </div>
    </div>
  );
}
export default Auth;
