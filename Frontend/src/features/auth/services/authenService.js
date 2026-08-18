import { authApi } from "../api/authenApi";

export const authService = {
    async register(username, password) {
        const data = await authApi.register(username, password);
        if (data.token) {
            localStorage.setItem('accessToken', data.token);
        }
        return data;
    },
};