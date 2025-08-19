// API Service for Google Apps Script Backend (via Vercel Proxy)
class ApiService {
    constructor() {
        // Use Vercel proxy API instead of calling GAS directly
        this.baseUrl = '/api/proxy';
    }

    async makeRequest(action, data = null, method = 'GET') {
        const url = `${this.baseUrl}?action=${action}`;
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data && method === 'POST') {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    }

    async getDashboardData() {
        return this.makeRequest('getDashboard');
    }

    async getAllSkus() {
        return this.makeRequest('getAllSkus');
    }

    async getInventorySnapshot() {
        return this.makeRequest('getInventorySnapshot');
    }

    async processAdminAction(adminData) {
        return this.makeRequest('processAdmin', adminData, 'POST');
    }
}

// Create global instance
const apiService = new ApiService();
