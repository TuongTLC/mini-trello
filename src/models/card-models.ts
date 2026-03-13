export interface cardInfoModel{
    boardID: string,
    cardDescription: string,
    cardID: string,
    cardTitle:string,
    createDate: string,
    uid: string
}
export interface cardCreateModel{
    card: cardModel,
}
export interface cardModel{
    boardID: string,
    cardDescription: string,
    cardTitle: string,
}
export interface cardUpdateModel {
    cardID: string;
    title: string;
    description?: string;
}