// Dashboard Logic
let dashboardData = null;

async function loadDashboard() {
    showLoading('dashboard-loading');
    document.getElementById('dashboard-content').classList.add('hidden');
    
    try {
        const response = await apiService.getDashboardData();
        
        if (response.success) {
            dashboardData = response.data;
            renderDashboard(dashboardData);
            document.getElementById('dashboard-content').classList.remove('hidden');
        } else {
            showToast(response.message || 'Failed to load dashboard data', 'error');
        }
    } catch (error) {
        showToast('Network error: Unable to connect to the server', 'error');
        console.error('Dashboard load error:', error);
    } finally {
        hideLoading('dashboard-loading');
    }
}

function renderDashboard(data) {
    const container = document.getElementById('dashboard-content');
    
    container.innerHTML = `
        <!-- Overview Stats -->
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Sales Today (Shop Only)</h3>
                <div class="value">${formatNumber(data.overall.salesToday)}</div>
            </div>
            <div class="stat-card">
                <h3>Total Inventory (Overall)</h3>
                <div class="value">${formatNumber(data.overall.totalStock)}</div>
            </div>
            <div class="stat-card">
                <h3>Shop Stock Quantity</h3>
                <div class="value">${formatNumber(data.shop.totalStock)}</div>
            </div>
            <div class="stat-card">
                <h3>Warehouse Stock Quantity</h3>
                <div class="value">${formatNumber(data.warehouse.totalStock)}</div>
            </div>
        </div>

        <!-- Sales Trend Chart -->
        <div class="chart-container">
            <h3>Sales Trend (Last 7 Days)</h3>
            <canvas id="salesTrendChart" width="400" height="200"></canvas>
        </div>

        <!-- Top Selling SKUs Chart -->
        <div class="chart-container">
            <h3>Top 5 Selling SKUs Today (Shop)</h3>
            <canvas id="topSellingChart" width="400" height="200"></canvas>
        </div>

        <!-- Low Stock Alerts -->
        <div class="chart-container">
            <h3>Low Stock Alerts (Below ${data.lowStockThreshold})</h3>
            <div class="stats-grid">
                <div>
                    <h4>Shop Low Stock</h4>
                    ${renderLowStockList(data.shop.lowStock)}
                </div>
                <div>
                    <h4>Warehouse Low Stock</h4>
                    ${renderLowStockList(data.warehouse.lowStock)}
                </div>
            </div>
        </div>

        <!-- Movement Records -->
        <div class="chart-container">
            <h3>Recent Movement Records (Last 30 Days)</h3>
            ${renderMovementRecords(data.warehouse.movementRecords)}
        </div>

        <!-- Inactive SKUs -->
        <div class="chart-container">
            <h3>Inactive SKUs (No Sales in Last 14 Days)</h3>
            ${renderInactiveSkus(data.inactiveSkus)}
        </div>
    `;

    // Render charts after DOM is updated
    setTimeout(() => {
        renderSalesTrendChart(data.overall.salesTrendData7Days);
        renderTopSellingChart(data.shop.topSellingSkus);
    }, 100);
}

function renderLowStockList(items) {
    if (!items || items.length === 0) {
        return '<p class="text-center">No low stock items.</p>';
    }

    return `
        <div style="max-height: 200px; overflow-y: auto; border: 1px solid var(--gray-200); border-radius: 8px;">
            ${items.map(item => `
                <div class="sale-item" style="background: #fef2f2; border-left: 4px solid var(--danger-color);">
                    <div>
                        <strong>${item.productName || item.sku}</strong>
                        ${item.productName && item.productName !== item.sku ? `<br><small>SKU: ${item.sku}</small>` : ''}
                    </div>
                    <span style="background: var(--danger-color); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-weight: bold;">
                        ${item.stock}
                    </span>
                </div>
            `).join('')}
        </div>
    `;
}

function renderMovementRecords(records) {
    if (!records || records.length === 0) {
        return '<p class="text-center">No movement records found.</p>';
    }

    return `
        <div style="max-height: 300px; overflow-y: auto; border: 1px solid var(--gray-200); border-radius: 8px;">
            ${records.slice(0, 10).map(record => {
                let badgeColor = 'var(--primary-color)';
                if (record.mode === 'RECEIVING') badgeColor = 'var(--secondary-color)';
                if (record.mode === 'TRANSFER') badgeColor = 'var(--warning-color)';
                
                return `
                    <div class="sale-item">
                        <div>
                            <strong>${record.productName || record.sku}</strong>
                            <br>
                            <small>${record.mode} from ${record.source} to ${record.destination} by ${record.user}</small>
                            <br>
                            <small style="color: var(--gray-500);">${record.timestamp}</small>
                        </div>
                        <span style="background: ${badgeColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-weight: bold;">
                            ${record.quantity}
                        </span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderInactiveSkus(items) {
    if (!items || items.length === 0) {
        return '<p class="text-center">All in-stock SKUs have recent sales.</p>';
    }

    return `
        <div style="max-height: 200px; overflow-y: auto; border: 1px solid var(--gray-200); border-radius: 8px;">
            ${items.map(item => `
                <div class="sale-item" style="background: #fffbeb; border-left: 4px solid var(--warning-color);">
                    <div>
                        <strong>${item.productName || item.sku}</strong>
                        ${item.productName && item.productName !== item.sku ? `<br><small>SKU: ${item.sku}</small>` : ''}
                    </div>
                    <span style="background: var(--warning-color); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-weight: bold;">
                        ${item.stock}
                    </span>
                </div>
            `).join('')}
        </div>
    `;
}

function renderSalesTrendChart(data) {
    const ctx = document.getElementById('salesTrendChart');
    if (!ctx) return;

    // Convert data format
    const chartData = data.slice(1).map(([date, sales]) => ({
        x: date,
        y: Number(sales) || 0
    }));

    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Sales Quantity',
                data: chartData,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        parser: 'YYYY-MM-DD',
                        displayFormats: {
                            day: 'MMM DD'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantity Sold'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderTopSellingChart(data) {
    const ctx = document.getElementById('topSellingChart');
    if (!ctx || !data || data.length === 0) return;

    const labels = data.map(item => item.productName || item.sku);
    const values = data.map(item => item.totalSold);
    const colors = [
        '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#6b7280'
    ];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}
