// managers/ProductManager.js
const fs = require('fs');
const path = require('path');

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, '../data/products.json');
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

  async getProducts() {
    return await this._loadData();
  }

  async getProductById(id) {
    const products = await this._loadData();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this._loadData();
    const newId = products.length ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
      id: newId,
      status: true,
      thumbnails: [],
      ...product
    };

    products.push(newProduct);
    await this._saveData(products);
    return newProduct;
  }

  async updateProduct(id, updateFields) {
    const products = await this._loadData();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    // No permitir cambiar el ID
    delete updateFields.id;
    products[index] = { ...products[index], ...updateFields };

    await this._saveData(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this._loadData();
    const filtered = products.filter(p => p.id !== id);
    await this._saveData(filtered);
  }
}

module.exports = ProductManager;
