// managers/CartManager.js
const fs = require('fs');
const path = require('path');

class CartManager {
  constructor() {
    this.path = path.join(__dirname, '../data/carts.json');
  }

  async _loadData() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data || '[]');
    } catch {
      return [];
    }
  }

  async _saveData(data) {
    await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._loadData();
    const newId = carts.length ? carts[carts.length - 1].id + 1 : 1;

    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await this._saveData(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this._loadData();
    return carts.find(c => c.id === id);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this._loadData();
    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex === -1) return null;

    const existing = carts[cartIndex].products.find(p => p.product === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      carts[cartIndex].products.push({ product: productId, quantity: 1 });
    }

    await this._saveData(carts);
    return carts[cartIndex];
  }
}

module.exports = CartManager;
