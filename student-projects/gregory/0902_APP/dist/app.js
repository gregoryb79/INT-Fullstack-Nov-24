// base requirements:
// multiple pages
// forms
// manage array of objects
// relation to other objects
// API
const itemsStorageKey = "items";
const inventoryStorageKey = "inventory";
const stockStorageKey = "stock";
let items = JSON.parse(localStorage.getItem(itemsStorageKey)) ?? [];
let stock = JSON.parse(localStorage.getItem(stockStorageKey)) ?? [];
let inventory = JSON.parse(localStorage.getItem(inventoryStorageKey)) ?? [];
export function getItems() {
    return items.slice();
}
export function clearInventory() {
    inventory = [];
    localStorage.removeItem(inventoryStorageKey);
}
export function updateInventory() {
    for (const item of items) {
        const inventoryItem = inventory.find(i => i.itemId === item.id);
        if ((!inventoryItem) && item.category != ("Supplies")) {
            const inventoryItem = {
                itemId: item.id,
                serial: item.serial
            };
            inventory.push(inventoryItem);
        }
    }
    localStorage.setItem(inventoryStorageKey, JSON.stringify(inventory));
    return "Success";
}
export function getStock() {
    return stock.slice();
}
export function getInventory() {
    return inventory.slice();
}
export function getItem(itemId) {
    const item = items.find((i) => i.id === itemId);
    return item ?? `Item with id "${itemId}" doesn't exist.`;
}
export function addItem(item) {
    if (items.some((i) => i.id === item.id)) {
        return `Id "${item.id}" already exists`;
    }
    items.push(item);
    localStorage.setItem(itemsStorageKey, JSON.stringify(items));
    return "Success";
}
export function editItem(item) {
    const itemToEdit = getItem(item.id);
    if (typeof itemToEdit === "string") {
        return itemToEdit;
    }
    itemToEdit.name = item.name;
    itemToEdit.description = item.description;
    itemToEdit.priceInAgorot = item.priceInAgorot;
    if (itemToEdit.category != "Supplies") {
        itemToEdit.serial = item.serial;
    }
    localStorage.setItem(itemsStorageKey, JSON.stringify(items));
    return "Success";
}
export function addToStock(itemId, amount) {
    const itemToAdd = getItem(itemId);
    if (typeof itemToAdd === "string") {
        return itemToAdd;
    }
    const stockItem = stock.find(i => i.itemId === itemId);
    if (stockItem) {
        stockItem.quantity += amount;
    }
    else {
        const stockItem = {
            itemId: itemId,
            quantity: amount
        };
        stock.push(stockItem);
    }
    localStorage.setItem(stockStorageKey, JSON.stringify(stock));
    return "Success";
}
export function updateStock(itemId, amount) {
    const itemToAdd = getItem(itemId);
    if (typeof itemToAdd === "string") {
        return itemToAdd;
    }
    const stockItem = stock.find(i => i.itemId === itemId);
    if (stockItem) {
        stockItem.quantity = amount;
    }
    else {
        const stockItem = {
            itemId: itemId,
            quantity: amount
        };
        stock.push(stockItem);
    }
    localStorage.setItem(stockStorageKey, JSON.stringify(stock));
    return "Success";
}
export function getQuantity(itemId) {
    const stockItem = stock.find(i => i.itemId === itemId);
    if (stockItem) {
        return stockItem.quantity;
    }
    else {
        return -1;
    }
}
export function addToInventory(itemId, amount) { }
export function consume(itemId, quantity) { }
export function acquire(itemId, serial) { }
export function decomission(serial) { }
