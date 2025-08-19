// API Service for Google Apps Script Backend
class ApiService {
    constructor() {
        // Your configured GAS deployment URL
        this.baseUrl = 'https://script.google.com/macros/s/AKfycbz7FTfsXUKOZ0yf30uk4txEDPo0hbfHaG8Z5Wk-QFbdUcLlFQz_lgQAwC_yLkI1gx4/exec';
    }

    async makeRequest(method, params = {}) {
        try {
            let url = this.baseUrl;
            let options = {
                method: method,
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            if (method === 'GET') {
                const searchParams = new URLSearchParams(params);
                url += `?${searchParams.toString()}`;
            } else {
                options.body = JSON.stringify(params);
            }

            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            return {
                success: false,
                data: null,
                message: error.message || 'An unknown error occurred',
                timestamp: new Date().toISOString()
            };
        }
    }

    async getDashboardData() {
        return this.makeRequest('GET', { action: 'getDashboard' });
    }

    async getAllSkus() {
        return this.makeRequest('GET', { action: 'getAllSkus' });
    }

    async getInventorySnapshot() {
        return this.makeRequest('GET', { action: 'getInventorySnapshot' });
    }

    async processAdminAction(data) {
        return this.makeRequest('POST', { action: 'processAdmin', data: data });
    }
}

// Global API instance
const api = new ApiService();
