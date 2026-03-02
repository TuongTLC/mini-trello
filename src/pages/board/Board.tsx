import "./Board.css";
import {useEffect, useState} from "react";
import {assigneeModel, userInfoModel, usersData} from "../../models/user-models";
import {getUserInfo, getUsers, userLogout, verifyToken} from "../../services/user-services";
import {useNavigate} from "react-router-dom";
import {boardCreateModel, boardInfoModel} from "../../models/board-models";
import {createBoard, deleteBoard, getBoards} from "../../services/board-services";
import {createCard, deleteCard, getCards} from "../../services/card-services";
import {cardInfoModel, cardCreateModel} from "../../models/card-models";
import {taskCreateModel, taskInfoModel} from "../../models/task-models";
import {createTask, deleteTask, getTasks} from "../../services/task-services";

function Board() {
    const navigate = useNavigate();
    const [user, setUser] = useState<userInfoModel | null>(null);
    const [boards, setBoards] = useState<boardInfoModel[]>([]);
    const [cards, setCard] = useState<cardInfoModel[]>([]);
    const [tasks, setTask] = useState<taskInfoModel[]>([]);

    const [loading, setLoading] = useState(true);
    const [boardName, setBoardName] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardDescription, setCardDescription] = useState("");
    const [boardNameErr, setBoardNameErr] = useState("err");
    const [cardNameErr, setCardNameErr] = useState("err");
    const [selectedBoardId, setSelectedBoardId] = useState("");
    const [selectedCardId, setSelectedCardId] = useState("");
    const [cardsWithTasks, setCardsWithTasks] = useState<{card: cardInfoModel, tasks: taskInfoModel[]}[]>([]);

    const [currentCard, setCurrentCard] = useState("");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [userCollection, setUserCollection] = useState<usersData | null>(null);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [createDate, setCreateDate] = useState<string>(new Date().toISOString());
    const [memberIds, setMemberIds] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [assignees, setAssignees] = useState<assigneeModel[]>([]);



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
    const createNewCard = async (boardID: string,) => {
        if (cardName === "") {
            setCardNameErr("Please enter card name!");
            return;
        }
        setCardNameErr("");
        try {
            const newCard: cardCreateModel = {
                card: {
                    boardID: boardID,
                    cardTitle: cardName,
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
    const createNewTask = async (cardID: string) => {
        try {
            const newTask: taskCreateModel = {
                cardId: cardID,
                title: title,
                description: description,
                dueDate: dueDate,
                startDate: startDate,
                createDate: createDate,
                memberIds: memberIds,
                isComplete: isComplete,
            }
            const response = await createTask(newTask);
            if (response.status === 201) {
                setTitle("");
                setDescription("");
                setDueDate("");
                setStartDate("");
                setMemberIds([]);
                setAssignees([]);
                setIsComplete(false);
                setCurrentCard("");

                await fetchCards(selectedBoardId);
            }
        } catch (error) {
            setCardNameErr("Something went wrong!");
        }
    }
    const removeBoard = async (boardId: string) => {
        try {
            const response = await deleteBoard(boardId);
            if (response.status === 200) {
                fetchBoards();
            }
        } catch (error) {
            console.log(error);
        }
    }
    const removeCard = async (cardId: string) => {
        try {
            const response = await deleteCard(cardId);
            if (response.status === 200) {
               await fetchCards(selectedBoardId);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const removeTask = async (taskId: string) => {
        try {
            const response = await deleteTask(taskId);
            if (response.status === 200) {
                await fetchCards(selectedBoardId);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const fetchUserData = async () => {
        try {
            const response = await getUserInfo();
            setUser(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    const fetchBoards = async () => {
        try {
            const response = await getBoards();
            setBoards(response.data);
            setSelectedBoardId(response.data[0].boardID);
            if (response.data.length > 0) {
                await fetchCards(response.data[0].boardID);
            }
        } catch (error) {
            console.log(error);
        }
    };const fetchCards = async (boardId: string) => {
        try {
            const response = await getCards(boardId);
            const cardsData = response.data;
            setSelectedBoardId(boardId);

            // Fetch tasks for each card and combine them
            const cardsWithTasksData = await Promise.all(
                cardsData.map(async (card: cardInfoModel) => {
                    try {
                        const taskResponse = await getTasks(card.cardID);
                        return {
                            card: card,
                            tasks: taskResponse.data || []
                        };
                    } catch (error) {
                        console.log(`Error fetching tasks for card ${card.cardID}:`, error);
                        return {
                            card: card,
                            tasks: []
                        };
                    }
                })
            );

            setCardsWithTasks(cardsWithTasksData);
        } catch (error) {
            console.log(error);
        }
    };
    const fetchTasks = async (cardId: string) => {
        try {
            const response = await getTasks(cardId);
            setTask(response.data);
            setSelectedCardId(cardId);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            setUserCollection(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    const userArray = userCollection ? Object.values(userCollection.users) : [];

    const addAssignee = (assigneeID: string) => {
        if (!assigneeID || assigneeID === "") return;

        if (assignees.some(a => a.id === assigneeID)) return;

        let selectedUser = userArray.find((user) => user.id === assigneeID);
        if (selectedUser) {
            const assignee = {
                id: assigneeID,
                name: selectedUser.name,
            };
            setAssignees(prev => [...prev, assignee]);
            setMemberIds(prev => [...prev, assignee.id]);
        }
    };

    const removeAssignee = (assigneeID: string) => {
        setAssignees(prev => prev.filter(assignee => assignee.id !== assigneeID));
        setMemberIds(prev => prev.filter(assignee => assignee !== assigneeID));
    };
    const tokenCheck = async () => {
        try{
            const response = await verifyToken();
            if (response.status === 401) {
                navigate("/")
            }
            return;
        }catch(error: unknown) {
            console.error("Verify token failed:", error);
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const response = await verifyToken();

                if (response.status === 401) {
                    navigate("/");
                    return;
                }

                await Promise.all([
                    fetchUserData(),
                    fetchBoards(),
                    fetchUsers()
                ]);

            } catch (error) {
                console.error(error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
                    <img className="user-pane-img" src={"src/assets/avatar.png"} alt="avatar"/>
                    <button className="logoutBtn" onClick={handleLogout}>Log out</button>
                </div>
            </div>
            <div className="middle-pane">
                <div className="left-pane">
                    <div><h3>{user.name} Workspace</h3></div>
                    <div className="board">
                        {boards?.map((board, i) => (
                            <div
                                key={i}
                                className={`board-item ${board.boardID === selectedBoardId ? 'selected' : ''}`}
                                onClick={() => fetchCards(board.boardID)}
                            >
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
                               placeholder="Enter card name"/><br/>
                        <input type={"text"}
                               value={cardDescription}
                               onChange={(e) => setCardDescription(e.target.value)}
                               placeholder="Enter Description"/><br/>

                        <button onClick={() => createNewCard(selectedBoardId)}>Add</button>
                    </div>
                    <>{cardsWithTasks?.map((cardWithTasks, i) => (
                        <div key={i} className="card-item">
                            <div className="card-title">
                                <button onClick={() => removeCard(cardWithTasks.card.cardID)}>X</button>
                                <p>{cardWithTasks.card.cardTitle}</p>
                                <p>{cardWithTasks.card.cardDescription}</p>
                            </div>
                            {cardWithTasks.tasks.map((task, j) => (
                                <div className="task-item" key={j}>
                                    <div>
                                        <button type="button" onClick={event => removeTask(task.taskId)}>X</button>
                                    </div>
                                    <div>
                                        <h3>{task.title}</h3>
                                    </div>
                                    <p>{task.description}</p>
                                    <div>
                                        <p>Start: {task.startDate}</p>
                                        <p>Due: {task.dueDate}</p>
                                    </div>
                                    <div>
                                        <strong>Assigned to:</strong>
                                        {task.memberIds?.map((member, k) => (
                                            <p key={k}>{member}</p>
                                        ))}
                                    </div>
                                    <div>
                                        <span>Status: {task.isComplete ? 'Complete' : 'Pending'}</span>
                                    </div>
                                </div>
                            ))}
                            {currentCard === cardWithTasks.card.cardID ? (
                                <div id="cardFormContainer" className="task-item">
                                    <h2 id="formHeading">Create New Card</h2>
                                    <form id="cardForm">
                                        <div>
                                            <input
                                                type="text"
                                                id="title"
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Enter task title*"
                                                value={title}
                                                required/>
                                        </div>

                                        <div>
                                            <textarea
                                                id="description"
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Enter detailed description"
                                                value={description}></textarea>
                                        </div>

                                        <div>
                                            <label htmlFor="startDate">Start Date</label><br/>
                                            <input
                                                type="datetime-local"
                                                id="startDate"
                                                onChange={(e) => setStartDate(e.currentTarget.value)}
                                            value={startDate}/>
                                        </div>

                                        <div>
                                            <label htmlFor="dueDate">Due Date</label><br/>
                                            <input
                                                type="datetime-local"
                                                id="dueDate"
                                                onChange={(e) => setDueDate(e.currentTarget.value)}
                                                min={startDate}
                                                value={dueDate}/>
                                        </div>


                                        <div>
                                            <label>Assigned to: </label><br/>
                                            <select onChange={(e) => addAssignee(e.target.value)}>
                                                <option value="">-Select-</option>
                                                {userArray.map((item, index) => (
                                                    <option key={index} value={item.id}>{item.name}</option>
                                                ))}
                                            </select>

                                            <div>
                                                {assignees.length > 0 ? (
                                                    <p>
                                                        {assignees.map((item , i) => (
                                                            <span key={i}>
                                                            {item.name}
                                                                {i < selectedItems.length - 1 ? ', ' : '.'}
                                                                <button type="button" onClick={e => removeAssignee(item.id)}>X</button>
                                                         </span>

                                                        ))}
                                                    </p>

                                                ) : (
                                                    <p>No items selected</p>
                                                )}
                                            </div>
                                        </div>


                                        <div>
                                            <input type="checkbox" checked={isComplete} id="isComplete" onChange={(e) => setIsComplete(e.target.checked)} />
                                            <label htmlFor="isComplete">Mark as Complete</label>
                                        </div>

                                        <div>
                                            <button type="button" id="closeTaskCreate" onClick={event => setCurrentCard("")}>Close</button>
                                            <button
                                                type="button"
                                                id="saveBtn"
                                                onClick={event => createNewTask( cardWithTasks.card.cardID)}>Save Card</button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div>
                                    <button onClick={event => setCurrentCard(cardWithTasks.card.cardID)}> Add</button>
                                </div>
                            )}
                        </div>
                    ))}
                    </>

                </div>
            </div>
        </div>
    );
}

export default Board;
