// MVP App for testing Google Sheets connection
class InventoryApp {
    constructor() {
        this.baseUrl = '/api'; // This will be your Vercel API routes
        this.init();
    }

    init() {
        this.bindEvents();
        this.showToast('MVP loaded successfully!', 'success');
        this.logEnvironmentInfo();
    }

    bindEvents() {
        document.getElementById('test-connection').addEventListener('click', () => {
            this.testConnection();
        });

        document.getElementById('fetch-inventory').addEventListener('click', () => {
            this.fetchInventoryData();
        });

        // Add debug button
        document.getElementById('debug-api').addEventListener('click', () => {
            this.debugAPI();
        });

        // Add Google Sheets test button
        document.getElementById('test-google-sheets').addEventListener('click', () => {
            this.testGoogleSheets();
        });
    }

    logEnvironmentInfo() {
        console.log('=== ENVIRONMENT INFO ===');
        console.log('Current URL:', window.location.href);
        console.log('Base URL:', this.baseUrl);
        console.log('User Agent:', navigator.userAgent);
        console.log('Platform:', navigator.platform);
        console.log('========================');
    }

    async testConnection() {
        this.updateConnectionStatus('Testing connection...', 'info');
        this.showToast('Testing connection...', 'info');

        try {
            // Test multiple endpoints
            console.log('🔍 Testing API endpoints...');
            
            // Test 1: Basic test endpoint
            console.log('Testing /api/test...');
            const testResponse = await fetch('/api/test');
            console.log('Test response status:', testResponse.status);
            console.log('Test response headers:', testResponse.headers);
            
            if (testResponse.ok) {
                const testData = await testResponse.json();
                console.log('Test response data:', testData);
                this.updateConnectionStatus('✅ Connection successful!', 'success');
                this.showToast('Connection successful!', 'success');
            } else {
                throw new Error(`HTTP ${testResponse.status}: ${testResponse.statusText}`);
            }

        } catch (error) {
            console.error('❌ Connection test failed:', error);
            this.updateConnectionStatus('❌ Connection failed: ' + error.message, 'error');
            this.showToast('Connection failed: ' + error.message, 'error');
        }
    }

    async testGoogleSheets() {
        this.updateConnectionStatus('Testing Google Sheets connection...', 'info');
        this.showToast('Testing Google Sheets connection...', 'info');

        try {
            console.log('🔍 Testing Google Sheets connection...');
            
            // Test the new Google Sheets test endpoint
            console.log('Testing /api/testGoogleSheets...');
            const response = await fetch('/api/testGoogleSheets');
            console.log('Google Sheets test response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Google Sheets test response data:', data);
                this.updateConnectionStatus('✅ Google Sheets connection successful!', 'success');
                this.showToast('Google Sheets connection successful!', 'success');
            } else {
                const errorData = await response.json();
                console.error('Google Sheets test failed:', errorData);
                this.updateConnectionStatus(`❌ Google Sheets failed: ${errorData.error}`, 'error');
                this.showToast(`Google Sheets failed: ${errorData.error}`, 'error');
            }

        } catch (error) {
            console.error('❌ Google Sheets test failed:', error);
            this.updateConnectionStatus('❌ Google Sheets test failed: ' + error.message, 'error');
            this.showToast('Google Sheets test failed: ' + error.message, 'error');
        }
    }

    async debugAPI() {
        this.updateConnectionStatus('Debugging API...', 'info');
        this.showToast('Debugging API...', 'info');

        try {
            console.log('🔍 Debugging API endpoints...');
            
            // Test debug endpoint
            console.log('Testing /api/debug...');
            const debugResponse = await fetch('/api/debug');
            console.log('Debug response status:', debugResponse.status);
            
            if (debugResponse.ok) {
                const debugData = await debugResponse.json();
                console.log('Debug response data:', debugData);
                this.updateConnectionStatus('✅ Debug endpoint working!', 'success');
                this.showToast('Debug endpoint working!', 'success');
            } else {
                throw new Error(`HTTP ${debugResponse.status}: ${debugResponse.statusText}`);
            }

        } catch (error) {
            console.error('❌ Debug failed:', error);
            this.updateConnectionStatus('❌ Debug failed: ' + error.message, 'error');
            this.showToast('Debug failed: ' + error.message, 'error');
        }
    }

    async fetchInventoryData() {
        this.updateConnectionStatus('Fetching inventory data...', 'info');
        this.showToast('Fetching inventory data...', 'info');

        try {
            const response = await fetch('/api/getInventory');
            
            if (response.ok) {
                const data = await response.json();
                console.log('Inventory data received:', data);
                
                if (data.success && data.data) {
                    this.displayInventoryData(data.data);
                    this.updateConnectionStatus(`✅ Loaded ${data.data.length} items`, 'success');
                    this.showToast(`Successfully loaded ${data.data.length} inventory items!`, 'success');
                } else {
                    throw new Error(data.error || 'No data received');
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

        } catch (error) {
            console.error('❌ Failed to fetch inventory:', error);
            this.updateConnectionStatus('❌ Failed to fetch inventory: ' + error.message, 'error');
            this.showToast('Failed to fetch inventory: ' + error.message, 'error');
        }
    }

    displayInventoryData(inventory) {
        const container = document.getElementById('inventory-data');
        
        if (!inventory || inventory.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">No inventory data found.</p>';
            return;
        }

        const table = `
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${inventory.map(item => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.sku || '-'}</td>
                                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${item.name || '-'}</td>
                                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${item.category || '-'}</td>
                                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${item.quantity || 0}</td>
                                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${item.location || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = table;
    }

    updateConnectionStatus(message, type) {
        const statusElement = document.getElementById('connection-status');
        statusElement.textContent = message;
        statusElement.className = `text-sm font-medium ${this.getStatusColor(type)}`;
    }

    getStatusColor(type) {
        switch (type) {
            case 'success': return 'text-green-600';
            case 'error': return 'text-red-600';
            case 'info': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    }

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${this.getToastColor(type)}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    getToastColor(type) {
        switch (type) {
            case 'success': return 'bg-green-500 text-white';
            case 'error': return 'bg-red-500 text-white';
            case 'warning': return 'bg-yellow-500 text-white';
            case 'info': return 'bg-blue-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InventoryApp();
});
