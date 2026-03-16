import axios from "axios";
import {cardCreateModel, cardUpdateModel} from "../models/card-models";
import { API_ENDPOINTS } from "./api-config";
const API_URL = API_ENDPOINTS.card;

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
export async function updateCard(cardData: cardUpdateModel) {
    try {
        const response = await axios.put(`${API_URL}/update-card`,
            { card: cardData },
            { withCredentials: true }
        );
        return response;
    } catch (error) {
        console.error("Error updating card:", error);
        throw error;
    }
}