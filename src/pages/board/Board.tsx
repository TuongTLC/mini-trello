import "./Board.css";
import { useEffect, useState } from "react";
import { userInfoModel } from "../../models/user-models";
import {getUserInfo, userLogout} from "../../services/user-services";
import {useNavigate} from "react-router-dom";

function Board() {
  const [user, setUser] = useState<userInfoModel | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo();
        setUser(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;
const handleLogout = async () => {
try{
  const response = await userLogout();
  if (response.status === 200) {
    navigate("/auth");
  }
}catch (error) {
  console.log(error);
}
}
  return (
    <div className="board-bg">
      <div className="top-pane">
        <div className="user-pane">
          <p className="user-name">{user.name}</p>
          <img className="user-pane-img" src={"src/assets/avatar.png"} />
          <button onClick={handleLogout}>Log out</button>
        </div>
      </div>
      <div className="left-pane">
        <h3>Members</h3>
        <div className="member">
          <>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="member-item">
                Member {i + 1}
              </div>
            ))}
          </>
        </div>
      </div>
      <div className="right-pane">
        <>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="board-item">
              Board {i + 1}
            </div>
          ))}
        </>
        <div className="board-item">Create Board</div>
      </div>
    </div>
  );
}

export default Board;
