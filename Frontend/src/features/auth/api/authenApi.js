import { apiClient } from "../../../api/client";

export const authApi = {
    register(username, password){
        return apiClient.post('/register', { username, password });
    }
}