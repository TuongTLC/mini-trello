import axios from "axios";
import {userAuthModel, userRegisterModel} from "../models/user-models";
import { API_ENDPOINTS } from "./api-config";

const API_URL = API_ENDPOINTS.user;

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
export async function verifyToken() {
    try {
        const response = await axios.post(
            `${API_URL}/verify-token`,{},
            { withCredentials: true }
        );
        return response;
    } catch (error) {
        console.log("Error during token verify: ", error);
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
export async function getUsers(){
    try{
        const response = await axios.get(`${API_URL}/get-users`, {
            withCredentials: true
        });
        return response;
    }catch (error) {
        console.log("Error during getting users :", error);
        throw error;
    }
}