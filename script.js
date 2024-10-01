// Select form elements
var form = document.getElementById('inventory-form');
var itemNameInput = document.getElementById('itemName');
var itemQuantityInput = document.getElementById('itemQuantity');
var itemPriceInput = document.getElementById('itemPrice');
var inventoryTableBody = document.querySelector('#inventory-table tbody');
var previewTableBody = document.querySelector('#preview-table tbody');
var previewPopup = document.getElementById('preview-popup');
var closePopupBtn = document.querySelector('.popup .close-btn');
var downloadBtn = document.getElementById('download-btn');
// Inventory array to store inventory items
var inventory = [];
var editIndex = null; // Index of item being edited
// Add item to inventory and render it
form.addEventListener('submit', function (event) {
    var _a, _b, _c;
    event.preventDefault();
    var itemName = (_a = itemNameInput === null || itemNameInput === void 0 ? void 0 : itemNameInput.value.trim()) !== null && _a !== void 0 ? _a : '';
    var itemQuantity = parseInt((_b = itemQuantityInput === null || itemQuantityInput === void 0 ? void 0 : itemQuantityInput.value) !== null && _b !== void 0 ? _b : '0', 10);
    var itemPrice = parseFloat((_c = itemPriceInput === null || itemPriceInput === void 0 ? void 0 : itemPriceInput.value) !== null && _c !== void 0 ? _c : '0');
    // Basic validation
    if (itemName === '' || isNaN(itemQuantity) || itemQuantity <= 0 || isNaN(itemPrice) || itemPrice <= 0) {
        alert('Please enter valid item details.');
        return;
    }
    // Create a new item object
    var newItem = {
        name: itemName,
        quantity: itemQuantity,
        price: itemPrice
    };
    if (editIndex !== null) {
        // Update the existing item
        inventory[editIndex] = newItem;
        editIndex = null; // Reset the edit index
    }
    else {
        // Add new item
        inventory.push(newItem);
    }
    // Render the inventory and the preview
    renderInventory();
    renderPreview();
    // Reset form fields
    form.reset();
});
// Render the inventory table
function renderInventory() {
    if (inventoryTableBody) {
        inventoryTableBody.innerHTML = ''; // Clear existing rows
        inventory.forEach(function (item, index) {
            var row = document.createElement('tr');
            row.innerHTML = "\n                <td>".concat(item.name, "</td>\n                <td>").concat(item.quantity, "</td>\n                <td>$").concat(item.price.toFixed(2), "</td>\n                <td>\n                    <button class=\"edit\">Edit</button>\n                    <button class=\"delete\">Delete</button>\n                </td>\n            ");
            // Add event listeners to the buttons for edit and delete
            var editButton = row.querySelector('.edit');
            var deleteButton = row.querySelector('.delete');
            if (editButton) {
                editButton.addEventListener('click', function () { return editItem(index); });
            }
            if (deleteButton) {
                deleteButton.addEventListener('click', function () { return deleteItem(index); });
            }
            // Ensure inventoryTableBody is not null before appending the row
            if (inventoryTableBody) {
                inventoryTableBody.appendChild(row);
            }
        });
    }
    else {
        console.error('Inventory table body element is missing from the DOM.');
    }
}
// Edit an existing item
function editItem(index) {
    var item = inventory[index];
    if (itemNameInput && itemQuantityInput && itemPriceInput) {
        itemNameInput.value = item.name;
        itemQuantityInput.value = item.quantity.toString();
        itemPriceInput.value = item.price.toString();
        // Set the edit index
        editIndex = index;
    }
    else {
        console.error('Input fields are missing from the DOM.');
    }
}
// Delete an item from the inventory
function deleteItem(index) {
    inventory.splice(index, 1);
    renderInventory();
    renderPreview();
}
// Render items in the preview table
function renderPreview() {
    if (previewTableBody) {
        previewTableBody.innerHTML = ''; // Clear existing rows
        inventory.forEach(function (item) {
            var row = document.createElement('tr');
            row.innerHTML = "\n                <td>".concat(item.name, "</td>\n                <td>").concat(item.quantity, "</td>\n                <td>$").concat(item.price.toFixed(2), "</td>\n            ");
            // Ensure previewTableBody is not null before appending the row
            if (previewTableBody) {
                previewTableBody.appendChild(row);
            }
        });
    }
    else {
        console.error('Preview table body element is missing from the DOM.');
    }
}
// Show the preview popup
function showPopup() {
    if (previewPopup) {
        previewPopup.style.display = 'flex';
    }
    else {
        console.error('Preview popup element is missing from the DOM.');
    }
}
// Hide the preview popup
function hidePopup() {
    if (previewPopup) {
        previewPopup.style.display = 'none';
    }
    else {
        console.error('Preview popup element is missing from the DOM.');
    }
}
// Add event listener to close the popup
if (closePopupBtn) {
    closePopupBtn.addEventListener('click', hidePopup);
}
// Add event listener to download button
// Add event listener to download button
if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
        if (previewTableBody) {
            var element = document.getElementById('preview-container');
            if (element) {
                // Define PDF options with margins
                var options = {
                    margin: [10, 10, 10, 10], // top, right, bottom, left
                    filename: 'inventory-items.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                // Generate and save the PDF
                html2pdf().from(element).set(options).save();
            }
        }
    });
}
