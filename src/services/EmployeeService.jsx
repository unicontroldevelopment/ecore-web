import qs from "qs";
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
  async create(employeeData) {
    try {
      const response = await api.post("/employee", employeeData);
      return response;
    } catch (error) {
      return error;
    }
  }
  async getById(employeeId) {
    try {
      const response = await api.get(`/employee/${employeeId}`);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getEmployees(role, name, department, company, unit) {
    const query = {
      role,
      name,
      department,
      company,
      unit,
    };

    try {
      const response = await api.get(`/employees?${qs.stringify(query)}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async delete(employeeId) {
    try {
      const response = await api.delete(`/employee/${employeeId}`);
      return response;
    } catch (error) {
      return error;
    }
  }
  async update(employeeId, employeeData) {
    try {
      const response = await api.put(`/employee/${employeeId}`, employeeData);
      return response;
    } catch (error) {
      return error;
    }
  }
}
