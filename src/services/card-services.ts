import axios from "axios";
import {cardCreateModel} from "../models/card-models";
const API_URL = "http://localhost:3001/card";

export async function getCards(boardID: string){
    try{
        const response = await axios.get(`${API_URL}/cards?boardID=${boardID}`, { withCredentials: true });
        return response;
    } catch(error){
        console.error("Error getting boards:" + error);
        throw error;
    }
}
export async function createCard(newCardModel: cardCreateModel){
    try{
        console.log(newCardModel);
        const response = await axios.post(`${API_URL}/create-card`,
            newCardModel,
            {
                withCredentials: true
            }
        );
        return response;
    }catch(error){
        console.error("Error creating card:",error);
        throw error;
    }
}
export async function deleteCard(carId:string){
    try{
        const response = await axios.delete(`${API_URL}/delete-card?cardID=${carId}`, { withCredentials: true });
        return response;
    }catch(error){
        console.error("Error deleting card:",error);
        throw error;
    }

}