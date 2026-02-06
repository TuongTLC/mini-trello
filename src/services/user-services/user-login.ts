import axios from "axios";

const API_URL = "http://localhost:3001/";

async function userLogin(email: string) {
  try {
    const response = await axios.post(`${API_URL}user/login`, { email });
    return response.data;
  } catch (error) {
    console.error("Error during user login:", error);
    throw error;
  }
}
export default userLogin;
