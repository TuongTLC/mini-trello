import axios from "axios";
import {userAuthModel, userRegisterModel} from "../models/user-models";

const API_URL = "http://localhost:3001/user";

export async function userRegister(user :userRegisterModel) {
    try {
        const response = await axios.post(`${API_URL}/register`, { user });
        return response;
    } catch (error) {
        console.error("Error during user register:", error);
        throw error;
    }
}
export async function userLogin(email: string) {
    try {
        const response = await axios.post(`${API_URL}/login`, { email });
        return response;
    } catch (error) {
        console.error("Error during user login:", error);
        throw error;
    }
}
export async function userAuth(user: userAuthModel) {
    try {
        const response = await axios.post(
            `${API_URL}/auth`,
            {user},
            { withCredentials: true }
        );

        return response;
    } catch (error) {
        console.log("Error during user auth:", error);
        throw error;
    }
}
export async function getUserInfo(){
    try{
        const response = await axios.get(`${API_URL}/get-user-info`, {
            withCredentials: true
        });
        return response;
    }catch (error) {
        console.log("Error during getting user info:", error);
        throw error;
    }
}
export async function userLogout() {
    try {
        const response = await axios.post(
            `${API_URL}/log-out`,{},
            { withCredentials: true }
        );
        return response;
    } catch (error) {
        console.log("Error during user log out:", error);
        throw error;
    }
}