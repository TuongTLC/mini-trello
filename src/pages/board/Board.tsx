import "./Board.css";
import {useEffect, useState} from "react";
import {assigneeModel, userInfoModel, usersData} from "../../models/user-models";
import {getUserInfo, getUsers, userLogout, verifyToken} from "../../services/user-services";
import {useNavigate} from "react-router-dom";
import {boardCreateModel, boardInfoModel, boardUpdateModel} from "../../models/board-models";
import {createBoard, deleteBoard, getBoards, updateBoard} from "../../services/board-services";
import {createCard, deleteCard, getCards, updateCard} from "../../services/card-services";
import {cardInfoModel, cardCreateModel, cardUpdateModel} from "../../models/card-models";
import {assignee, taskCreateModel, taskInfoModel, taskUpdateModel} from "../../models/task-models";
import {createTask, deleteTask, getTasks, updateTask} from "../../services/task-services";

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
    const [boardNameErr, setBoardNameErr] = useState("Add new board");
    const [cardNameErr, setCardNameErr] = useState("Add new card");
    const [selectedBoardId, setSelectedBoardId] = useState("");
    const [selectedCardId, setSelectedCardId] = useState("");
    const [selectedTaskId, setSelectedTaskId] = useState("");
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
    const [boardEdit, setBoardEdit] = useState<boolean>(false);
    const [cardEdit, setCardEdit] = useState<boolean>(false);
    const [taskEdit, setTaskEdit] = useState<boolean>(false);
    const [assignedTaskEdit, setAssignedTaskEdit] = useState<assignee[]>([]);
    const [boardEditModel, setBoardEditModel] = useState<boardUpdateModel>({
        boardID: '',
        boardName: ''
    });
    const [cardEditModel, setCardEditModel] = useState<cardUpdateModel>({
        cardID: '',
        title: '',
        description: ''
    });
    const [taskEditModel, setTaskEditModel] = useState<taskUpdateModel>({
        taskId: '',
        title: '',
        description: '',
        isComplete: false
    });


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
                setBoardNameErr("Add new board");
                fetchBoards();
            }
        } catch (error) {
            setBoardNameErr("Something went wrong!");
        }
    }
    const handleUpdateBoard = async () => {
        try {
            if (!boardEditModel.boardID || !boardEditModel.boardName.trim()) {
                console.error("Board ID and name are required");
                return;
            }

            await updateBoard(boardEditModel);
            setSelectedBoardId('');
            setBoardEdit(false);
            await fetchBoards();
        } catch (error) {
            console.error("Failed to update board:", error);
        }
    };
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
                setCardNameErr("Add new card");
                fetchCards(boardID);
            }
        } catch (error) {
            setCardNameErr("Something went wrong!");
        }
    }
    const handleUpdateCard = async () => {
        try {

            if (!cardEditModel.cardID || !cardEditModel.title.trim()) {
                console.error("Card ID and title are required");
                console.log(cardEditModel);
                return;
            }
            await updateCard(cardEditModel);
            setCardEdit(false);
            setSelectedCardId('');
            setCardEditModel({
                cardID: '',
                title: '',
                description: ''
            });
            await fetchCards(selectedBoardId);
        } catch (error) {
            console.error("Failed to update card:", error);
        }
    };
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
        }
    }
    const handleUpdateTask = async () => {
        const taskUpdateData: taskUpdateModel = {
            taskId: taskEditModel.taskId,
            title: taskEditModel.title,
            description: taskEditModel.description,
            dueDate: taskEditModel.dueDate,
            startDate: taskEditModel.startDate,
            isComplete: taskEditModel.isComplete,
            memberIds: assignedTaskEdit.map(assignee => assignee.uuid)
        };
        try {
            if (!taskEditModel.taskId || !taskEditModel.title.trim()) {
                console.error("Task ID and title are required");
                return;
            }
            await updateTask(taskUpdateData);
            setTaskEdit(false);
            await fetchCards(selectedBoardId);
            setAssignedTaskEdit([]);
            setTaskEditModel({
                taskId: '',
                title: '',
                description: '',
                dueDate: '',
                startDate: '',
                isComplete: false
            });
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

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
    };
    const fetchCards = async (boardId: string) => {
        try {
            const response = await getCards(boardId);
            const cardsData = response.data;
            setSelectedBoardId(boardId);

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
    const convertTime = (dateStr: string) => {
        const date = new Date(dateStr);

        return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} ` +
            `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    const setTaskEditAssignee = (assignees: {[uuid: string]: assignee} | null | undefined) => {
        if (!assignees) {
            setAssignedTaskEdit([]);
            return;
        }
        const assigneeArray = Object.values(assignees);
        setAssignedTaskEdit(assigneeArray);
    };
    const addTaskEditAssignee = (assigneeID: string) => {
        if (!assigneeID || assigneeID === "") return;

        if (assignedTaskEdit.some(a => a.uuid === assigneeID)) return;

        let selectedUser = userArray.find((user) => user.id === assigneeID);
        if (selectedUser) {
            const assignee = {
                uuid: assigneeID,
                name: selectedUser.name,
            };
            setAssignedTaskEdit(prev => [...prev, assignee]);
        }
    };
    const removeTaskEditAssignee = (index: number) => {
        const newAssignees = [...assignedTaskEdit];
        newAssignees.splice(index, 1);
        setAssignedTaskEdit(newAssignees);
    };

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
                <div className="main-title">
                    <p>Mini Trello</p>
                </div>
                <div className="user-pane">
                    <p className="user-name">{user.name}</p>
                    <img className="user-pane-img" src={"src/assets/avatar.png"} alt="avatar"/>
                    <button className="logoutBtn" onClick={handleLogout}>Log out</button>
                </div>
            </div>
            <div className="middle-pane">
                <div className="left-pane">
                    <div ><h3>{user.name} Workspace</h3></div>
                    <div className="board">
                        {boards?.map((board, i) => (
                            <div
                                key={i}
                                className={`board-item ${board.boardID === selectedBoardId ? 'selected' : ''}`}
                                onClick={() => fetchCards(board.boardID)}
                            >
                                {!boardEdit || (boardEdit && board.boardID !== selectedBoardId) ? (
                                    <div>
                                        <p>{board.boardName}</p>
                                        <button onClick={() => removeBoard(board.boardID)}>Delete</button>
                                        <button onClick={() => {
                                            setBoardEdit(true);
                                            setSelectedBoardId(board.boardID);
                                            setBoardEditModel({
                                                boardID: board.boardID,
                                                boardName: board.boardName
                                            });
                                        }}>Edit</button>
                                    </div>
                                ) : null}
                                {boardEdit && board.boardID === selectedBoardId &&
                                    <div>
                                        <input
                                            type="text"
                                            value={boardEditModel.boardName}
                                            onChange={(e) => {
                                                setBoardEditModel({
                                                    boardID: board.boardID,
                                                    boardName: e.target.value
                                                });
                                            }}
                                        /><br/>
                                        <button onClick={() => setBoardEdit(false)}>Cancel</button>
                                        <button onClick={handleUpdateBoard}>Save</button>
                                    </div>
                                }

                            </div>
                        ))}

                        <div className="board-item">
                            <p>{boardNameErr}</p>
                            <input
                                type="text"
                                value={boardName}
                                onChange={(e) => setBoardName(e.target.value)}
                                placeholder="Enter board name..."
                            /><br/>
                            <button onClick={createNewBoard}>Add board</button>
                        </div>
                    </div>
                </div>
                <div className="right-pane">
                    <div className="create-card">
                        <p>{cardNameErr}</p>
                        <input type={"text"}
                               value={cardName}
                               onChange={(e) => setCardName(e.target.value)}
                               placeholder="Enter card name..."/><br/>
                        <textarea
                            rows={2}
                               value={cardDescription}
                               onChange={(e) => setCardDescription(e.target.value)}
                               placeholder="Enter description..."/><br/>

                        <button onClick={() => createNewCard(selectedBoardId)}>Add card</button>
                    </div>
                    <>{cardsWithTasks?.map((cardWithTasks, i) => (
                        <div key={i} className="card-item">
                            {!cardEdit || (cardEdit && cardWithTasks.card.cardID !== selectedCardId) ? (
                                <div className="card-title">
                                    <button onClick={() => removeCard(cardWithTasks.card.cardID)}>Delete</button>
                                    <button onClick={()=> {setCardEdit(true); setSelectedCardId(cardWithTasks.card.cardID); setCardEditModel({
                                        ...cardEditModel,
                                        cardID: cardWithTasks.card.cardID,
                                        title: cardWithTasks.card.cardTitle,
                                        description: cardWithTasks.card.cardDescription,
                                    })}}>Edit</button>
                                    <p>{cardWithTasks.card.cardTitle}</p>
                                    <p>{cardWithTasks.card.cardDescription}</p>
                                </div>
                            ) : null}
                            {cardEdit && selectedCardId === cardWithTasks.card.cardID &&
                                <div className="card-title">
                                    <input
                                        type="text"
                                        placeholder={cardWithTasks.card.cardTitle}
                                        value={cardEditModel.title}
                                        onChange={(e) => setCardEditModel({
                                            ...cardEditModel,
                                            title: e.target.value
                                        })}
                                    /><br/>
                                    <textarea
                                        value={cardEditModel.description}
                                        placeholder={cardWithTasks.card.cardDescription}
                                        onChange={(e) => setCardEditModel({
                                            ...cardEditModel,
                                            description: e.target.value
                                        })}
                                    /><br/>
                                    <button onClick={() => {setCardEdit(false)}}>Cancel</button>
                                    <button onClick={handleUpdateCard}>Save</button>
                                </div>
                            }
                            {cardWithTasks.tasks.map((task, j) => (
                                <div className="task-item" key={j}>
                                    {!taskEdit &&
                                        <div>
                                            <div>
                                                <button type="button" onClick={event => removeTask(task.taskId)}>Delete</button>
                                                <button onClick={()=> {setTaskEdit(true); setSelectedTaskId(task.taskId);setTaskEditAssignee(task.assignees); setTaskEditModel(
                                                    {
                                                        ...taskEditModel,
                                                        taskId: task.taskId,
                                                        title: task.title,
                                                        description: task.description,
                                                        dueDate: task.dueDate,
                                                        startDate: task.startDate,
                                                        isComplete: task.isComplete,

                                                    }
                                                )}}>Edit</button>
                                            </div>
                                            <div>
                                                <h3>{task.title}</h3>
                                            </div>
                                            <p>{task.description}</p>
                                            <div>
                                                <strong>Start:</strong>
                                                <p> {convertTime(task.startDate)}</p>
                                                <strong>Due:</strong>
                                                <p> {convertTime(task.dueDate)}</p>
                                            </div>
                                            <div>
                                                <strong>Assigned to:</strong>
                                                {Object.values(task.assignees || {}).map((member, k) => (
                                                    <p key={k}>{member.name}</p>
                                                ))}
                                            </div>
                                            <div>
                                                <strong>Status:</strong> {task.isComplete ? 'Complete' : 'Pending'}
                                            </div>
                                        </div>
                                    }
                                    {taskEdit &&
                                        <div>
                                            <div>
                                                <button onClick={event => setTaskEdit(false)}>Cancel</button>
                                                <button onClick={()=> handleUpdateTask()}>Save</button>
                                            </div>
                                            <div>
                                                <p>Title:</p>
                                                <input
                                                    type="text"
                                                    value={taskEditModel.title}
                                                    onChange={(e) => setTaskEditModel({
                                                        ...taskEditModel,
                                                        title: e.target.value
                                                    })}/>
                                            </div>
                                            <div>
                                                <p>Description:</p>
                                                <input
                                                    type="text"
                                                    value={taskEditModel.description}
                                                    onChange={(e) => setTaskEditModel({
                                                        ...taskEditModel,
                                                        description: e.target.value
                                                    })}/>
                                            </div>
                                            <div>
                                                <label>Start Date: </label><br/>
                                                <input
                                                    type="datetime-local"
                                                    onChange={(e) => setTaskEditModel({
                                                        ...taskEditModel,
                                                        startDate: e.target.value
                                                    })}
                                                    value={taskEditModel.startDate}
                                                    className="icon-only-picker"/><br/>

                                                <label>Due Date: </label><br/>
                                                <input
                                                    type="datetime-local"
                                                    onChange={(e) => setTaskEditModel({
                                                        ...taskEditModel,
                                                        dueDate: e.target.value
                                                    })}
                                                    min={startDate}
                                                    value={taskEditModel.dueDate}
                                                    className="icon-only-picker"/><br/>
                                            </div>
                                            <div>
                                                <label>Assigned to: </label><br/>
                                                <select onChange={(e) => addTaskEditAssignee(e.target.value)}>
                                                    <option value="">-Select-</option>
                                                    {userArray?.map((item, index) => (
                                                        <option key={index} value={item.id}>{item.name}</option>
                                                    ))}
                                                </select>

                                                {assignedTaskEdit.map((assignee, index) => (
                                                    <p key={index}>
                                                        {assignee.name}
                                                        <button onClick={() => removeTaskEditAssignee(index)}>X</button>
                                                    </p>
                                                ))}

                                            </div>
                                            <div>
                                                <label>Complete:</label>
                                                <input
                                                    type={"checkbox"}
                                                    checked={taskEditModel.isComplete}
                                                    onChange={(e) => setTaskEditModel({
                                                        ...taskEditModel,
                                                        isComplete: e.target.checked
                                                    })}
                                                ></input>
                                            </div>
                                        </div>
                                    }
                                </div>
                            ))}
                            {currentCard === cardWithTasks.card.cardID ? (
                                <div id="task-form-container" className="task-item">
                                    <h2 id="formHeading">Create New Card</h2>
                                    <form id="task-form">
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
                                            <label htmlFor="startDate">Start Date: </label>
                                            <input
                                                type="datetime-local"
                                                id="startDate"
                                                onChange={(e) => setStartDate(e.currentTarget.value)}
                                                value={startDate}
                                                className="icon-only-picker"
                                            /><br/>
                                        </div>

                                        <div>
                                            <label htmlFor="dueDate">Due Date: </label>
                                            <input
                                                type="datetime-local"
                                                id="dueDate"
                                                onChange={(e) => setDueDate(e.currentTarget.value)}
                                                min={startDate}
                                                value={dueDate}
                                                className="icon-only-picker"/><br/>
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
                                                onClick={event => createNewTask( cardWithTasks.card.cardID)}>Save Task</button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                    <button className="addTaskBtn" onClick={event => setCurrentCard(cardWithTasks.card.cardID)}>Add task</button>
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
