// Main App Logic
let currentPage = 'home';
let currentAdminTab = 'transfer';
let skuList = [];
let inventorySnapshot = {};

// Page Navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Hide main content if showing a page
    const mainContent = document.querySelector('.main-content');
    
    if (pageName === 'home') {
        mainContent.style.display = 'block';
        currentPage = 'home';
    } else {
        mainContent.style.display = 'none';
        document.getElementById(`${pageName}-page`).classList.remove('hidden');
        currentPage = pageName;
        
        // Load page-specific data
        if (pageName === 'dashboard') {
            loadDashboard();
        } else if (pageName === 'admin') {
            loadAdminData();
            showAdminTab(currentAdminTab);
        }
    }
}

// Admin Tab Navigation
function showAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="showAdminTab('${tabName}')"]`).classList.add('active');
    
    currentAdminTab = tabName;
    renderAdminForm(tabName);
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('Perabot Megah Inventory System Loaded');
    
    // Load initial data
    loadSkus();
    loadInventorySnapshot();
});

// Load SKUs for autocomplete
async function loadSkus() {
    try {
        const response = await apiService.getAllSkus();
        if (response.success) {
            skuList = response.data || [];
        }
    } catch (error) {
        console.error('Failed to load SKUs:', error);
    }
}

// Load inventory snapshot for stock display
async function loadInventorySnapshot() {
    try {
        const response = await apiService.getInventorySnapshot();
        if (response.success) {
            inventorySnapshot = response.data || {};
        }
    } catch (error) {
        console.error('Failed to load inventory snapshot:', error);
    }
}

// Get current stock for display
function getCurrentStock(sku, location) {
    const key = `${sku.toUpperCase()}|${location}`;
    return inventorySnapshot[key] || 0;
}

// Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (container.contains(toast)) {
            container.removeChild(toast);
        }
    }, 5000);
    
    // Allow manual close
    toast.addEventListener('click', () => {
        if (container.contains(toast)) {
            container.removeChild(toast);
        }
    });
}

// Loading State Management
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
    }
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}

// Format numbers
function formatNumber(num) {
    return Number(num).toLocaleString();
}
