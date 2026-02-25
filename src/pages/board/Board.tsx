import "./Board.css";
import { useEffect, useState } from "react";
import { userInfoModel } from "../../models/user-models";
import { getUserInfo, userLogout } from "../../services/user-services";
import { useNavigate } from "react-router-dom";
import { boardCreateModel, boardInfoModel } from "../../models/board-models";
import {createBoard, deleteBoard, getBoards} from "../../services/board-services";
import {createCard, deleteCard, getCards} from "../../services/card-services";
import {cardInfoModel, cardCreateModel} from "../../models/card-models";

function Board() {
  const [user, setUser] = useState<userInfoModel | null>(null);
  const [boards, setBoards] = useState<boardInfoModel[]>([]);
  const [cards, setCard] = useState<cardInfoModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [boardName, setBoardName] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [boardNameErr, setBoardNameErr] = useState("err");
  const [cardNameErr, setCardNameErr] = useState("err");
  const [selectedBoardId, setSelectedBoardId] = useState("err");

  const navigate = useNavigate();

  const createNewBoard = async () => {
    if (boardName === "") {
      setBoardNameErr("Please enter board name!");
      return;
    }
    setBoardNameErr("");
    try {
      const newBoard: boardCreateModel = {
        board: {
          boardName,
        }
      }
      const response = await createBoard(newBoard);
      if (response.status === 201) {
        setBoardName("");
        setBoardNameErr("Successfully created board!");
        fetchBoards();
      }
    } catch (error) {
      setBoardNameErr("Something went wrong!");
    }
  }
  const createNewCard = async (boardID: string, ) => {
    if (cardName === "") {
      setCardNameErr("Please enter card name!");
      return;
    }
    setCardNameErr("");
    try {
      const newCard: cardCreateModel = {
        card: {
          boardID: boardID,
          cardTitle : cardName,
          cardDescription: cardDescription
        }
      }
      const response = await createCard(newCard);
      if (response.status === 201) {
        setCardName("");
        setCardDescription("");
        setCardNameErr("Successfully created board!");
        fetchCards(boardID);
      }
    } catch (error) {
      setCardNameErr("Something went wrong!");
    }
  }
  const removeBoard = async (boardId: string) => {
    try{
      const response = await deleteBoard(boardId);
      if (response.status === 200) {
        fetchBoards();
      }
    }catch(error){
      console.log(error);
    }
  }
  const removeCard = async (cardId: string) => {
    try{
      const response = await deleteCard(cardId);
      if (response.status === 200) {
        fetchCards(selectedBoardId);
      }
    }catch(error){
      console.log(error);
    }
  }
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
  const fetchBoards = async () => {
    try {
      const response = await getBoards();
      setBoards(response.data);
      if(response.data.length > 0) {
        await fetchCards(response.data[0].boardID);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  const fetchCards = async (boardId:string) => {
    try {
      const response = await getCards(boardId);
      setCard(response.data);
      setSelectedBoardId(boardId)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {

    fetchBoards()
    fetchUserData();

  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;

  const handleLogout = async () => {
    try {
      const response = await userLogout();
      if (response.status === 200) {
        navigate("/auth");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
      <div className="board-bg">
        <div className="top-pane">
          <div className="user-pane">
            <p className="user-name">{user.name}</p>
            <img className="user-pane-img" src={"src/assets/avatar.png"} alt="avatar" />
            <button className="logoutBtn" onClick={handleLogout}>Log out</button>
          </div>
        </div>
        <div className="middle-pane">
          <div className="left-pane">
            <div><h3>{user.name} Workspace</h3></div>
            <div className="board">
              {boards?.map((board, i) => (
                  <div key={i} className="board-item" onClick={()=> fetchCards(board.boardID)}>
                    <p>{board.boardName}</p>
                    <button onClick={() => removeBoard(board.boardID)}>X</button>
                  </div>

              ))}
              <div className="board-item">
                <p>{boardNameErr}</p>
                <input
                    type="text"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    placeholder="Enter board name"
                />
                <button onClick={createNewBoard}>Add</button>
              </div>
            </div>
          </div>

          <div className="right-pane">
            <div className="create-card">
              <p>{cardNameErr}</p>
              <input type={"text"}
                     value={cardName}
                     onChange={(e) => setCardName(e.target.value)}
                     placeholder="Enter card name" /><br/>
              <input type={"text"}
                     value={cardDescription}
                     onChange={(e) => setCardDescription(e.target.value)}
                     placeholder="Enter Description" /><br/>

              <button onClick={()=> createNewCard(selectedBoardId)}>Add</button>
            </div>
            <>{cards?.map((card, i) => (
                <div key={i} className="card-item">
                  <button onClick={()=> removeCard(card.cardID)}>X</button>
                  <p>{card.cardTitle}</p>
                  <p>{card.cardDescription}</p>
                  <>
                    {Array.from({ length: 8 }).map((_, j) => (
                        <div key={j} className="task-item">
                          <p>Task {j + 1}</p>
                          <p>To do {j + 1}</p>
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                            ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                        </div>
                    ))}
                  </>
                  <div className="task-item"><button className="create-task">Add new task</button></div>
                </div>
                ))}
            </>

          </div>
        </div>
      </div>
  );
}

export default Board;
