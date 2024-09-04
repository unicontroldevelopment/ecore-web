/* eslint-disable react/prop-types */
import * as React from "react";
import * as XLSX from 'xlsx';
import VerifyUserRole from "../../hooks/VerifyUserRole";

const FileUpload = () => {
  VerifyUserRole(["Master", "Administrador"]);
  const [movements, setMovements] = React.useState([
    {
      id: 1,
      Produto: "Porta Isca",
      Quantidade: 10,
      Tipo: "Saida",
      Valor: 100.00,
      Data: "2024-09-01",
      Operador: "Charles",
    },
    {
      id: 1,
      Produto: "Porta Isca",
      Quantidade: 5,
      Tipo: "Entrada",
      Valor: 100.00,
      Data: "2024-09-01",
      Operador: "Daiana",
    },
    // mais movimentações...
  ]);

  function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(movements);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Movimentações");

    // Gerando arquivo Excel
    XLSX.writeFile(workbook, "Movimentações.xlsx");
  }

  return (
    <div>
      <h1>Lista de Movimentações</h1>
      <button onClick={exportToExcel}>Exportar para Excel</button>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Tipo</th>
            <th>Operador</th>
            <th>Valor</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => (
            <tr key={movement.id}>
              <td>{movement.Produto}</td>
              <td>{movement.Quantidade}</td>
              <td>{movement.Tipo}</td>
              <td>{movement.Operador}</td>
              <td>{movement.Valor}</td>
              <td>{movement.Data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileUpload;
