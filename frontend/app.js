// MVP App for testing Google Sheets connection
class InventoryApp {
    constructor() {
        this.baseUrl = '/api'; // This will be your Vercel API routes
        this.init();
    }

    init() {
        this.bindEvents();
        this.showToast('MVP loaded successfully!', 'success');
    }

    bindEvents() {
        document.getElementById('test-connection').addEventListener('click', () => {
            this.testConnection();
        });

        document.getElementById('fetch-inventory').addEventListener('click', () => {
            this.fetchInventoryData();
        });
    }

    async testConnection() {
        this.updateConnectionStatus('Testing connection...', 'info');
        this.showToast('Testing connection...', 'info');

        try {
            // Test basic connectivity
            const response = await fetch(`${this.baseUrl}/test`);
            
            if (response.ok) {
                const data = await response.json();
                this.updateConnectionStatus('Connection successful!', 'success');
                this.showToast('Connection successful!', 'success');
                this.updateRawResponse(data);
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Connection test failed:', error);
            this.updateConnectionStatus(`Connection failed: ${error.message}`, 'error');
            this.showToast(`Connection failed: ${error.message}`, 'error');
        }
    }

    async fetchInventoryData() {
        this.updateConnectionStatus('Fetching inventory data...', 'info');
        this.showToast('Fetching inventory data...', 'info');

        try {
            const response = await fetch(`${this.baseUrl}/getInventory`);
            
            if (response.ok) {
                const data = await response.json();
                this.updateConnectionStatus('Data fetched successfully!', 'success');
                this.showToast('Data fetched successfully!', 'success');
                this.displayInventoryData(data);
                this.updateRawResponse(data);
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
            this.updateConnectionStatus(`Failed to fetch data: ${error.message}`, 'error');
            this.showToast(`Failed to fetch data: ${error.message}`, 'error');
        }
    }

    updateConnectionStatus(message, type) {
        const statusElement = document.getElementById('connection-status');
        const iconElement = statusElement.querySelector('.alert-icon i');
        const titleElement = statusElement.querySelector('.alert-title');
        const messageElement = statusElement.querySelector('.alert-message');

        // Update alert type
        statusElement.className = `alert alert-${type}`;
        
        // Update icon
        const icons = {
            info: 'fa-info-circle',
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle'
        };
        iconElement.className = `fas ${icons[type] || 'fa-info-circle'}`;
        
        // Update content
        titleElement.textContent = type === 'success' ? 'Success!' : 
                                 type === 'error' ? 'Error!' : 
                                 type === 'warning' ? 'Warning!' : 'Info';
        messageElement.textContent = message;
    }

    displayInventoryData(data) {
        const displayElement = document.getElementById('data-display');
        
        if (!data || !data.items || data.items.length === 0) {
            displayElement.innerHTML = `
                <div class="text-center text-neutral-500">
                    <i class="fas fa-inbox text-4xl mb-4"></i>
                    <p>No inventory items found.</p>
                </div>
            `;
            return;
        }

        // Create a simple table to display the data
        let tableHTML = `
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.items.forEach(item => {
            tableHTML += `
                <tr>
                    <td>${item.sku || 'N/A'}</td>
                    <td>${item.name || 'N/A'}</td>
                    <td>${item.category || 'N/A'}</td>
                    <td>${item.quantity || '0'}</td>
                    <td>${item.location || 'N/A'}</td>
                </tr>
            `;
        });

        tableHTML += `
                    </tbody>
                </table>
            </div>
            <div class="mt-4 text-sm text-neutral-600">
                <strong>Total Items:</strong> ${data.items.length}
            </div>
        `;

        displayElement.innerHTML = tableHTML;
    }

    updateRawResponse(data) {
        const rawElement = document.getElementById('raw-response');
        rawElement.textContent = JSON.stringify(data, null, 2);
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getToastIcon(type)}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'times-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InventoryApp();
});

// Add some utility functions for development
window.debugApp = {
    testLocalConnection: async () => {
        console.log('Testing local connection...');
        try {
            const response = await fetch('/api/test');
            const data = await response.json();
            console.log('Local API response:', data);
            return data;
        } catch (error) {
            console.error('Local API error:', error);
            return null;
        }
    },
    
    testGoogleSheets: async () => {
        console.log('Testing Google Sheets connection...');
        try {
            const response = await fetch('/api/getInventory');
            const data = await response.json();
            console.log('Google Sheets data:', data);
            return data;
        } catch (error) {
            console.error('Google Sheets error:', error);
            return null;
        }
    }
};
