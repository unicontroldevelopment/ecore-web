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
      const response = await api.post("/user", userData);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getUsers() {
    try {
      console.log("api");
      const response = await api.get("/list")
      return response;
    } catch (error) {
      return error;
    }
  }
}
