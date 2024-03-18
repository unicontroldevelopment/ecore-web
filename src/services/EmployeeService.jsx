import { api } from "./api";

export default class {
  async login(email, password) {
    try {
      const response = await api.post("/login", { email, password });
      return response;
    } catch (error) {
      return error;
    }
  }
  async create(userData) {
    try {
      const response = await api.post("/employee", userData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async getById(employeeData) {
    try {
      const response = await api.get("employee/:id", employeeData)
      return response;
    } catch (error) {
      return error;
    }
  }

  async getUsers() {
    try {
      const response = await api.get("/employees")
      return response;
    } catch (error) {
      return error;
    }
  }
  async delete(employeeId) {
    try {
      const response = await api.delete(`employee/${employeeId}`)
      return response;
    } catch (error) {
      return error;
    }
  }
}
