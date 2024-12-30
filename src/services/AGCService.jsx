import { api } from "./api";

export default class {
  async buscaInsumos() {
    try {
      const response = await api.get("/buscaInsumos");
      return response;
    } catch (error) {
      return error;
    }
  }

  async buscaInsumosMovimentacao() {
    try {
      const response = await api.get("/insumosMovimentacao");
      return response;
    } catch (error) {
      return error;
    }
  }

  async buscarProdutos() {
    try {
      const response = await api.get("/buscarProdutos");
      return response;
    } catch (error) {
      return error;
    }
  }
}
