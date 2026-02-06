import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import Auth from "./pages/login-auth/Auth.jsx";
import Board from "./pages/board/Board.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/auth" element={<Auth />} />
        <Route exact path="/board" element={<Board />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
