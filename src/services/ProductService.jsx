import { api } from "./api";

export default class {
  async create(productData) {
    try {
      const response = await api.post("/product", productData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async getById(productId) {
    try {
      const response = await api.get(`/product/${productId}`);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getproducts() {
    try {
      const response = await api.get(`/products`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async delete(productId) {
    try {
      const response = await api.delete(`/product/${productId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async update(productId, productData) {
    try {
      const response = await api.put(`/product/${productId}`, productData);
      return response;
    } catch (error) {
      return error;
    }
  }
}
