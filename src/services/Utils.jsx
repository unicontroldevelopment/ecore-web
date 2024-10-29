import { api } from "./api";

export default class {
  async valueExtensible(value) {
    try {
      const response = await api.post("/valueExtensible", value);
      return response;
    } catch (error) {
      return error;
    }
  }
  async uploadPDF(upload) {
    try {
      const response = await api.post("/upload", upload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
  async updatePDF(upload) {
    try {
      const response = await api.put("/updatePDF", upload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
  async uploadAdditivePDF(upload) {
    try {
      const response = await api.post("/uploadAdditive", upload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
  async updateAdditivePDF(upload) {
    try {
      const response = await api.put("/updateAdditivePDF", upload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
  async findCep(cep) {
    try {
      const response = await api.post("/cep", { cep });
      return response;
    } catch (error) {
      return error;
    }
  }
  async searchDate(initialDate, endDate) {
    try {
      const response = await api.post("/buscaHorasTrabalhadasRH", {
        date_ini: initialDate,
        date_fim: endDate,
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  async searchDate(initialDate, endDate) {
    try {
      const response = await api.post("/buscaHorasTrabalhadasRH", {
        date_ini: initialDate,
        date_fim: endDate,
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  async buscaInsumos() {
    try {
      const response = await api.get("/buscaInsumos");
      return response;
    } catch (error) {
      return error;
    }
  }
  async buscaPedidos() {
    try {
      const response = await api.get("/pedidos");
      return response;
    } catch (error) {
      return error;
    }
  }
  async buscaProdutosPedidos(id_pedido) {
    try {
      const response = await api.post("/buscar-produtos-pedido", {
        id_pedido: id_pedido,
      });
      return response;
    } catch (error) {
      return error;
    }
  }
  async finalizarPedido(id_pedido, numero_nf) {
    try {
      const response = await api.put("/finalizar", {
        id_pedido: id_pedido,
        numero_nf: numero_nf,
      });
      return response;
    } catch (error) {
      return error;
    }
  }
  async compradoPedido(id_pedido, data_nf) {
    try {
      const response = await api.post("/alterarStatusComprado", {
        id_pedido: id_pedido,
        data_nf: data_nf,
      });
      return response;
    } catch (error) {
      return error;
    }
  }
  async canceladoPedido(id_pedido) {
    try {
      const response = await api.post("/alterarStatusCancelado", {
        id_pedido: id_pedido,
      });
      return response;
    } catch (error) {
      return error;
    }
  }
}
