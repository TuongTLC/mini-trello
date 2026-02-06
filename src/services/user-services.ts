import axios from "axios";
import {userAuthModel, userRegisterModel} from "../models/user-models";

const API_URL = "http://localhost:3001/";

export async function userRegister(user :userRegisterModel) {
    try {
        const response = await axios.post(`${API_URL}user/register`, { user });
        return response;
    } catch (error) {
        console.error("Error during user register:", error);
        throw error;
    }
}
export async function userLogin(email: string) {
    try {
        const response = await axios.post(`${API_URL}user/login`, { email });
        return response;
    } catch (error) {
        console.error("Error during user login:", error);
        throw error;
    }
}
export async function userAuth(user: userAuthModel) {
    try{
        const response = await axios.post(`${API_URL}user/auth`, { user });
        return response;
    }catch (error) {
        console.log("Error during user auth:", error);
        throw error;
    }
}
