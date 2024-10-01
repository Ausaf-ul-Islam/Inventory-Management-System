// Declare html2pdf as a global variable
declare const html2pdf: any;

// Define the InventoryItem interface for type safety
interface InventoryItem {
    name: string;
    quantity: number;
    price: number;
}

// Select form elements
const form: HTMLFormElement | null = document.getElementById('inventory-form') as HTMLFormElement;
const itemNameInput: HTMLInputElement | null = document.getElementById('itemName') as HTMLInputElement;
const itemQuantityInput: HTMLInputElement | null = document.getElementById('itemQuantity') as HTMLInputElement;
const itemPriceInput: HTMLInputElement | null = document.getElementById('itemPrice') as HTMLInputElement;
const inventoryTableBody: HTMLElement | null = document.querySelector('#inventory-table tbody');
const previewTableBody: HTMLElement | null = document.querySelector('#preview-table tbody');
const previewPopup: HTMLElement | null = document.getElementById('preview-popup');
const closePopupBtn: HTMLElement | null = document.querySelector('.popup .close-btn');
const downloadBtn: HTMLElement | null = document.getElementById('download-btn');

// Inventory array to store inventory items
let inventory: InventoryItem[] = [];
let editIndex: number | null = null; // Index of item being edited

// Add item to inventory and render it
form.addEventListener('submit', (event: Event) => {
    event.preventDefault();

    const itemName: string = itemNameInput?.value.trim() ?? '';
    const itemQuantity: number = parseInt(itemQuantityInput?.value ?? '0', 10);
    const itemPrice: number = parseFloat(itemPriceInput?.value ?? '0');

    // Basic validation
    if (itemName === '' || isNaN(itemQuantity) || itemQuantity <= 0 || isNaN(itemPrice) || itemPrice <= 0) {
        alert('Please enter valid item details.');
        return;
    }

    // Create a new item object
    const newItem: InventoryItem = {
        name: itemName,
        quantity: itemQuantity,
        price: itemPrice
    };

    if (editIndex !== null) {
        // Update the existing item
        inventory[editIndex] = newItem;
        editIndex = null; // Reset the edit index
    } else {
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
function renderInventory(): void {
    if (inventoryTableBody) {
        inventoryTableBody.innerHTML = ''; // Clear existing rows

        inventory.forEach((item: InventoryItem, index: number) => {
            const row: HTMLTableRowElement = document.createElement('tr');

            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;

            // Add event listeners to the buttons for edit and delete
            const editButton: HTMLButtonElement | null = row.querySelector('.edit');
            const deleteButton: HTMLButtonElement | null = row.querySelector('.delete');

            if (editButton) {
                editButton.addEventListener('click', () => editItem(index));
            }

            if (deleteButton) {
                deleteButton.addEventListener('click', () => deleteItem(index));
            }

            // Ensure inventoryTableBody is not null before appending the row
            if (inventoryTableBody) {
                inventoryTableBody.appendChild(row);
            }
        });
    } else {
        console.error('Inventory table body element is missing from the DOM.');
    }
}

// Edit an existing item
function editItem(index: number): void {
    const item: InventoryItem = inventory[index];

    if (itemNameInput && itemQuantityInput && itemPriceInput) {
        itemNameInput.value = item.name;
        itemQuantityInput.value = item.quantity.toString();
        itemPriceInput.value = item.price.toString();

        // Set the edit index
        editIndex = index;
    } else {
        console.error('Input fields are missing from the DOM.');
    }
}

// Delete an item from the inventory
function deleteItem(index: number): void {
    inventory.splice(index, 1);
    renderInventory();
    renderPreview();
}

// Render items in the preview table
function renderPreview(): void {
    if (previewTableBody) {
        previewTableBody.innerHTML = ''; // Clear existing rows

        inventory.forEach((item: InventoryItem) => {
            const row: HTMLTableRowElement = document.createElement('tr');

            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
            `;

            // Ensure previewTableBody is not null before appending the row
            if (previewTableBody) {
                previewTableBody.appendChild(row);
            }
        });
    } else {
        console.error('Preview table body element is missing from the DOM.');
    }
}

// Show the preview popup
function showPopup(): void {
    if (previewPopup) {
        previewPopup.style.display = 'flex';
    } else {
        console.error('Preview popup element is missing from the DOM.');
    }
}

// Hide the preview popup
function hidePopup(): void {
    if (previewPopup) {
        previewPopup.style.display = 'none';
    } else {
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
    downloadBtn.addEventListener('click', () => {
        if (previewTableBody) {
            const element = document.getElementById('preview-container');
            if (element) {
                // Define PDF options with margins
                const options = {
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

