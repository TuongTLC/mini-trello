import "./Board.css"
function Board() {
  return (
    <div className="board-bg">
      <div className="top-pane">
        <div className="user-pane">
          <p className="user-name">Tuong Trinh</p>
          <img className="user-pane-img"  src={"src/assets/avatar.png"}/>

        </div>
      </div>
      <div className="left-pane">
        <h3>Members</h3>
        <div className="member">
          <>
              {
                  Array.from({ length: 10 }).map((_, i) => (
                      <div className="member-item">Member {i+1}</div>

                  ))
              }
          </>
        </div>
      </div>
      <div className="right-pane">
            <>
                {Array.from({ length: 10 }).map((_, i) => (
                    <div className="board-item">
                        Board {i+1}
                    </div>

                ))}
            </>
          <div className="board-item">
              Create Board
          </div>
      </div>
    </div>
  )
}
export default Board;
