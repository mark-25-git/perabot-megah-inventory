// Admin Panel Logic
let saleItems = [];

async function loadAdminData() {
    // Refresh SKUs and inventory snapshot
    await loadSkus();
    await loadInventorySnapshot();
}

function renderAdminForm(tabName) {
    const container = document.getElementById('admin-content');
    
    switch (tabName) {
        case 'transfer':
            container.innerHTML = renderTransferForm();
            break;
        case 'receiving':
            container.innerHTML = renderReceivingForm();
            break;
        case 'adjustment':
            container.innerHTML = renderAdjustmentForm();
            break;
        case 'sale':
            container.innerHTML = renderSaleForm();
            break;
    }
    
    // Setup form handlers
    setupFormHandlers(tabName);
}

function renderTransferForm() {
    return `
        <div class="form-container">
            <form id="transfer-form">
                <div class="form-group">
                    <label class="form-label">SKU</label>
                    <div class="sku-selector">
                        <input type="text" id="transfer-sku" class="form-input" placeholder="Type to search..." autocomplete="off" required>
                        <div id="transfer-sku-dropdown" class="sku-dropdown hidden"></div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Source Location</label>
                    <div class="location-selector">
                        <button type="button" class="location-btn active" data-location="Warehouse">Warehouse</button>
                        <button type="button" class="location-btn" data-location="Shop">Shop</button>
                    </div>
                    <small id="transfer-stock-info" class="text-gray-600">Current Stock: 0</small>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="transfer-quantity">Quantity to Transfer</label>
                    <input type="number" id="transfer-quantity" class="form-input" min="1" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="transfer-notes">Notes (Optional)</label>
                    <input type="text" id="transfer-notes" class="form-input">
                </div>
                
                <button type="submit" class="btn">Submit Transfer</button>
            </form>
        </div>
    `;
}

function renderReceivingForm() {
    return `
        <div class="form-container">
            <form id="receiving-form">
                <div class="form-group">
                    <label class="form-label">SKU</label>
                    <div class="sku-selector">
                        <input type="text" id="receiving-sku" class="form-input" placeholder="Type to search..." autocomplete="off" required>
                        <div id="receiving-sku-dropdown" class="sku-dropdown hidden"></div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Destination</label>
                    <div class="location-selector">
                        <button type="button" class="location-btn active" data-location="Warehouse">Warehouse</button>
                        <button type="button" class="location-btn" data-location="Shop">Shop</button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="receiving-quantity">Quantity Received</label>
                    <input type="number" id="receiving-quantity" class="form-input" min="1" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="receiving-notes">Notes (Optional)</label>
                    <input type="text" id="receiving-notes" class="form-input">
                </div>
                
                <button type="submit" class="btn">Log Receiving</button>
            </form>
        </div>
    `;
}

function renderAdjustmentForm() {
    return `
        <div class="form-container">
            <form id="adjustment-form">
                <div class="form-group">
                    <label class="form-label">SKU</label>
                    <div class="sku-selector">
                        <input type="text" id="adjustment-sku" class="form-input" placeholder="Type to search..." autocomplete="off" required>
                        <div id="adjustment-sku-dropdown" class="sku-dropdown hidden"></div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Location</label>
                    <div class="location-selector">
                        <button type="button" class="location-btn active" data-location="Warehouse">Warehouse</button>
                        <button type="button" class="location-btn" data-location="Shop">Shop</button>
                    </div>
                    <small id="adjustment-stock-info" class="text-gray-600">Current System Stock: 0</small>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="adjustment-quantity">New Physical Quantity</label>
                    <input type="number" id="adjustment-quantity" class="form-input" min="0" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="adjustment-notes">Notes (Required - e.g., "Annual stock take")</label>
                    <input type="text" id="adjustment-notes" class="form-input" required placeholder="Reason for adjustment">
                </div>
                
                <button type="submit" class="btn">Submit Adjustment</button>
            </form>
        </div>
    `;
}

function renderSaleForm() {
    return `
        <div class="form-container">
            <!-- Add Item Form -->
            <form id="sale-add-form">
                <h3>Add Sale Item</h3>
                <div class="form-group">
                    <label class="form-label">SKU</label>
                    <div class="sku-selector">
                        <input type="text" id="sale-sku" class="form-input" placeholder="Type to search..." autocomplete="off" required>
                        <div id="sale-sku-dropdown" class="sku-dropdown hidden"></div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="sale-quantity">Quantity</label>
                    <input type="number" id="sale-quantity" class="form-input" min="1" required placeholder="e.g., 5">
                </div>
                
                <button type="submit" class="btn btn-secondary">Add Item to List</button>
            </form>
            
            <!-- Sale Items List -->
            <div style="margin-top: 2rem;">
                <h3>Items to Submit (<span id="sale-count">0</span>)</h3>
                <div id="sale-items-container">
                    <p class="text-center" style="padding: 2rem; color: var(--gray-500);">No items added yet.</p>
                </div>
                
                <div class="form-group" style="margin-top: 1rem;">
                    <label class="form-label" for="sale-general-notes">General Notes (Optional)</label>
                    <input type="text" id="sale-general-notes" class="form-input">
                </div>
                
                <button id="submit-all-sales" class="btn" disabled>Submit All Sales</button>
            </div>
        </div>
    `;
}

function setupFormHandlers(tabName) {
    // Setup SKU autocomplete
    setupSkuAutocomplete(`${tabName}-sku`);
    
    // Setup location selectors
    setupLocationSelector(tabName);
    
    // Setup form submission
    const form = document.getElementById(`${tabName}-form`) || document.getElementById(`${tabName}-add-form`);
    if (form) {
        form.addEventListener('submit', (e) => handleFormSubmit(e, tabName));
    }
    
    // Setup stock info updates
    if (tabName === 'transfer' || tabName === 'adjustment') {
        const skuInput = document.getElementById(`${tabName}-sku`);
        if (skuInput) {
            skuInput.addEventListener('input', () => updateStockInfo(tabName));
        }
    }
    
    // Setup sale-specific handlers
    if (tabName === 'sale') {
        document.getElementById('submit-all-sales').addEventListener('click', submitAllSales);
        renderSaleItems();
    }
}

function setupSkuAutocomplete(inputId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(`${inputId}-dropdown`);
    
    if (!input || !dropdown) return;
    
    input.addEventListener('input', function() {
        const value = this.value.trim().toUpperCase();
        
        if (value.length === 0) {
            dropdown.classList.add('hidden');
            return;
        }
        
        const filtered = skuList.filter(sku => 
            sku.toUpperCase().includes(value)
        ).slice(0, 10);
        
        if (filtered.length === 0) {
            dropdown.classList.add('hidden');
            return;
        }
        
        dropdown.innerHTML = filtered.map(sku => 
            `<div class="sku-option" data-sku="${sku}">${sku}</div>`
        ).join('');
        
        dropdown.classList.remove('hidden');
        
        // Add click handlers
        dropdown.querySelectorAll('.sku-option').forEach(option => {
            option.addEventListener('click', function() {
                input.value = this.dataset.sku;
                dropdown.classList.add('hidden');
                input.dispatchEvent(new Event('input'));
            });
        });
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

function setupLocationSelector(tabName) {
    const buttons = document.querySelectorAll(`#${tabName}-form .location-btn, #${tabName}-add-form .location-btn`);
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active from all buttons in this group
            this.parentElement.querySelectorAll('.location-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active to clicked button
            this.classList.add('active');
            
            // Update stock info if needed
            if (tabName === 'transfer' || tabName === 'adjustment') {
                updateStockInfo(tabName);
            }
        });
    });
}

function updateStockInfo(tabName) {
    const skuInput = document.getElementById(`${tabName}-sku`);
    const locationBtn = document.querySelector(`#${tabName}-form .location-btn.active`);
    const infoElement = document.getElementById(`${tabName}-stock-info`);
    
    if (!skuInput || !locationBtn || !infoElement) return;
    
    const sku = skuInput.value.trim();
    const location = locationBtn.dataset.location;
    
    if (sku && location) {
        const stock = getCurrentStock(sku, location);
        infoElement.textContent = `Current ${tabName === 'adjustment' ? 'System ' : ''}Stock: ${stock}`;
    }
}

async function handleFormSubmit(e, tabName) {
    e.preventDefault();
    
    if (tabName === 'sale') {
        handleAddSaleItem(e);
        return;
    }
    
    const formData = getFormData(tabName);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    try {
        const response = await api.processAdminAction(formData);
        
        if (response.success && response.data.success) {
            showToast(response.data.message, 'success');
            
            // Reset form
            e.target.reset();
            
            // Reset location selector to first option
            const firstLocationBtn = e.target.querySelector('.location-btn');
            if (firstLocationBtn) {
                e.target.querySelectorAll('.location-btn').forEach(btn => btn.classList.remove('active'));
                firstLocationBtn.classList.add('active');
            }
            
            // Refresh inventory data
            await loadInventorySnapshot();
            updateStockInfo(tabName);
            
        } else {
            showToast(response.data?.message || response.message || 'Operation failed', 'error');
        }
    } catch (error) {
        showToast('Network error: Unable to process request', 'error');
        console.error('Form submission error:', error);
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = getSubmitButtonText(tabName);
    }
}

function getFormData(tabName) {
    const data = { mode: tabName };
    
    // Get SKU
    data.sku = document.getElementById(`${tabName}-sku`).value.trim();
    
    // Get location
    const locationBtn = document.querySelector(`#${tabName}-form .location-btn.active`);
    if (locationBtn) {
        if (tabName === 'transfer') {
            data.source = locationBtn.dataset.location;
        } else if (tabName === 'receiving') {
            data.destination = locationBtn.dataset.location;
        } else if (tabName === 'adjustment') {
            data.location = locationBtn.dataset.location;
        }
    }
    
    // Get quantity
    if (tabName === 'adjustment') {
        data.newQuantity = parseInt(document.getElementById(`${tabName}-quantity`).value);
    } else {
        data.quantity = parseInt(document.getElementById(`${tabName}-quantity`).value);
    }
    
    // Get notes
    const notesInput = document.getElementById(`${tabName}-notes`);
    if (notesInput) {
        data.notes = notesInput.value.trim();
    }
    
    return data;
}

function getSubmitButtonText(tabName) {
    switch (tabName) {
        case 'transfer': return 'Submit Transfer';
        case 'receiving': return 'Log Receiving';
        case 'adjustment': return 'Submit Adjustment';
        default: return 'Submit';
    }
}

function handleAddSaleItem(e) {
    e.preventDefault();
    
    const sku = document.getElementById('sale-sku').value.trim().toUpperCase();
    const quantity = parseInt(document.getElementById('sale-quantity').value);
    
    if (!sku || !quantity || quantity < 1) {
        showToast('Please enter a valid SKU and quantity', 'error');
        return;
    }
    
    // Add to sale items
    saleItems.push({ sku, quantity });
    
    // Reset form
    document.getElementById('sale-sku').value = '';
    document.getElementById('sale-quantity').value = '';
    
    // Re-render sale items
    renderSaleItems();
    
    showToast(`Added ${quantity} of ${sku} to sale list`, 'success');
}

function renderSaleItems() {
    const container = document.getElementById('sale-items-container');
    const countElement = document.getElementById('sale-count');
    const submitBtn = document.getElementById('submit-all-sales');
    
    countElement.textContent = saleItems.length;
    
    if (saleItems.length === 0) {
        container.innerHTML = '<p class="text-center" style="padding: 2rem; color: var(--gray-500);">No items added yet.</p>';
        submitBtn.disabled = true;
    } else {
        container.innerHTML = `
            <div class="sale-items">
                ${saleItems.map((item, index) => `
                    <div class="sale-item">
                        <div>
                            <strong>${item.sku}</strong>
                            <br>
                            <small>Qty: ${item.quantity}</small>
                        </div>
                        <button class="remove-btn" onclick="removeSaleItem(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        submitBtn.disabled = false;
    }
}

function removeSaleItem(index) {
    saleItems.splice(index, 1);
    renderSaleItems();
    showToast('Item removed from sale list', 'success');
}

async function submitAllSales() {
    if (saleItems.length === 0) {
        showToast('No items to submit', 'error');
        return;
    }
    
    const submitBtn = document.getElementById('submit-all-sales');
    const notes = document.getElementById('sale-general-notes').value.trim();
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    try {
        const response = await api.processAdminAction({
            mode: 'bulk-sale',
            sales: saleItems,
            notes: notes
        });
        
        if (response.success && response.data.success) {
            showToast(response.data.message, 'success');
            
            // Clear sale items
            saleItems = [];
            renderSaleItems();
            
            // Clear notes
            document.getElementById('sale-general-notes').value = '';
            
            // Refresh inventory data
            await loadInventorySnapshot();
            
        } else {
            showToast(response.data?.message || response.message || 'Sale submission failed', 'error');
        }
    } catch (error) {
        showToast('Network error: Unable to submit sales', 'error');
        console.error('Sale submission error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit All Sales';
    }
}
