const BASE_URL = 'http://localhost:5500/api';

class ApiClient {
    async request(endpoint, options = {}) {
        const url = `${BASE_URL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...this._getAuthHeaders(),
            ...options.headers,
        };

        const config = {
            ...options,
            headers,
            credentials: 'include',
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try{
            const response = await fetch(url, config);
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw data;
            }
            return data;
        } catch (error) {
            console.error(`[API Lỗi tại ${endpoint}]:`, error);
            throw error;
        }
    }

    _getAuthHeaders() {
        const token = localStorage.getItem('accessToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    get(endpoint){
        return this.request(endpoint);
    }
    post(endpoint, body){
        return this.request(endpoint, {method: 'POST', body});
    }
    put(endpoint, body){
        return this.request(endpoint, {method: 'PUT', body});
    }
    delete(endpoint){
        return this.request(endpoint, {method: 'DELETE'});
    }
}

export const apiClient = new ApiClient();