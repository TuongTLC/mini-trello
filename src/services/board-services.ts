import axios from "axios";
import {boardCreateModel, boardInfoModel, boardUpdateModel} from "../models/board-models";
import { API_ENDPOINTS } from "./api-config";
const API_URL = API_ENDPOINTS.board;

export async function getBoards(){
    try{
        const response = await axios.get(`${API_URL}/boards`, { withCredentials: true });
        return response;
    } catch(error){
        console.error("Error getting boards:" + error);
        throw error;
    }
}
export async function createBoard(newBoardModel: boardCreateModel){
    try{
        console.log(newBoardModel);
        const response = await axios.post(`${API_URL}/create-board`,
            newBoardModel,
            {
            withCredentials: true
        }
        );
        return response;
    }catch(error){
        console.error("Error creating board:",error);
        throw error;
    }
}
export async function deleteBoard(boardId:string){
    try{
        const response = await axios.delete(`${API_URL}/delete-board?boardID=${boardId}`, { withCredentials: true });
        return response;
    }catch(error){
        console.error("Error deleting board:",error);
        throw error;
    }
}
export async function updateBoard(boardData: boardUpdateModel) {
    try {
        const response = await axios.put(`${API_URL}/update-board`,
            { board: boardData },
            { withCredentials: true }
        );
        return response;
    } catch (error) {
        console.error("Error updating board:", error);
        throw error;
    }
}



