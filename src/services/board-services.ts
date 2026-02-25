import axios from "axios";
import { boardCreateModel, boardInfoModel} from "../models/board-models";
const API_URL = "http://localhost:3001/board";

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