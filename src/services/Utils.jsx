import { api } from "./api";

export default class {
  async valueExtensible(value) {
    try {
        console.log("Cheguei");
      const response = await api.post("/valueExtensible", value);
      return response;
    } catch (error) {
      return error;
    }
  }
}