import axios from "axios";
import {taskCreateModel, taskUpdateModel} from "../models/task-models";
import { API_ENDPOINTS } from "./api-config";
const API_URL = API_ENDPOINTS.task;

export async function getTasks(cardID: string){
    try{
        const response = await axios.get(`${API_URL}/tasks?cardId=${cardID}`, { withCredentials: true });
        return response;
    } catch(error){
        console.error("Error getting tasks:" + error);
        throw error;
    }
}
export async function createTask(newTaskModel: taskCreateModel){
    try{
        console.log(newTaskModel);
        const response = await axios.post(`${API_URL}/create-task`,
            newTaskModel,
            {
                withCredentials: true
            }
        );
        return response;
    }catch(error){
        console.error("Error creating task:",error);
        throw error;
    }
}
export async function deleteTask(taskID:string){
    try{
        const response = await axios.delete(`${API_URL}/delete-task?taskId=${taskID}`, { withCredentials: true });
        return response;
    }catch(error){
        console.error("Error deleting task:",error);
        throw error;
    }

}
export async function updateTask(taskData: taskUpdateModel) {
    try {
        const response = await axios.put(`${API_URL}/update-task`,
            { task: taskData },
            { withCredentials: true }
        );
        return response;
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
}
