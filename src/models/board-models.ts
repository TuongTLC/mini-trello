export interface boardInfoModel {
    boardID: string;
    boardName: string;
    uid: string;
    createDate: string;
}
export interface boardCreateModel{
    board: boardModel;
}
export interface boardModel{
    boardName: string;
}
export interface boardUpdateModel {
    boardID: string;
    boardName: string;
}
