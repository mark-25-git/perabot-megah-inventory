// API Service for Google Apps Script Backend
class ApiService {
    constructor() {
        // Your configured GAS deployment URL
        this.baseUrl = 'https://script.google.com/macros/s/AKfycbz7FTfsXUKOZ0yf30uk4txEDPo0hbfHaG8Z5Wk-QFbdUcLlFQz_lgQAwC_yLkI1gx4/exec';
        
        // CORS proxy to bypass Google Apps Script CORS restrictions
        this.corsProxy = 'https://cors-anywhere.herokuapp.com/';
        
        // Alternative CORS proxies if the first one doesn't work
        this.corsProxies = [
            'https://cors-anywhere.herokuapp.com/',
            'https://api.allorigins.win/raw?url=',
            'https://cors.bridged.cc/',
            'https://thingproxy.freeboard.io/fetch/'
        ];
        
        this.currentProxyIndex = 0;
    }

    async makeRequest(action, data = null, method = 'GET') {
        const url = `${this.baseUrl}?action=${action}`;
        
        // Try different CORS proxies if one fails
        for (let i = 0; i < this.corsProxies.length; i++) {
            try {
                const proxyUrl = this.corsProxies[i] + url;
                
                const options = {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                };

                if (data && method === 'POST') {
                    options.body = JSON.stringify(data);
                }

                const response = await fetch(proxyUrl, options);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                return result;
                
            } catch (error) {
                console.log(`CORS proxy ${i + 1} failed:`, error.message);
                
                // If this is the last proxy, throw the error
                if (i === this.corsProxies.length - 1) {
                    throw error;
                }
                
                // Try next proxy
                continue;
            }
        }
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
