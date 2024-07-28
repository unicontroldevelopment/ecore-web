import * as React from "react";

import { Button } from "antd";
import { PDFDocument } from "pdf-lib";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import EmployeeService from "../../../services/EmployeeService";
import { Options } from "../../../utils/options";
import { cessationOfUseNotebook } from "../../../utils/pdf/documents/cessationOfUseNotebook";
import { cessationOfUsePhone } from "../../../utils/pdf/documents/cessationOfUsePhone";

export default function CreateDocument() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const service = new EmployeeService();
  const [employees, setEmployees] = React.useState([]);
  const [values, setValues] = React.useState({
    employee: "",
    employeeDetails: {},
    document: "",
  });
  const [phone, setPhone] = React.useState({
    model: "",
    value: "",
    brand: "",
    imei: "",
    accessories: "",
    state: "",
  })
  const [notebook, setNotebook] = React.useState({
    notebookBrand: "",
    notebookProperty: "",
  })

  const state = [
    "Novo",
    "Usado"
  ]

  React.useEffect(() => {
    const fetchUsers = async () => {
      const allEmployeesRequest = await service.getEmployees();
      const allEmployees = allEmployeesRequest.data.listUsers;

      setEmployees(allEmployees);
    };
    fetchUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    setValues((prevState) => {
      const updatedValues = {
        ...prevState,
        [name]: value,
      };

      if (name === "employee") {
        const selectedEmployee = employees.find(emp => emp.name === value);
        updatedValues.employeeDetails = selectedEmployee || {};
      }

      return updatedValues;
    });
  };

  const handleChangePhone = (event) => {
    const { name, value } = event.target;
    
    setPhone((prevState) => {
      const updatedValues = {
        ...prevState,
        [name]: value,
      };

      return updatedValues;
    });
  };

  const handleChangeNotebook = (event) => {
    const { name, value } = event.target;
    
    setNotebook((prevState) => {
      const updatedValues = {
        ...prevState,
        [name]: value,
      };

      return updatedValues;
    });
  };

  const handleGenerate = async () => {
    let document;
    const dataExtenso = new Date().getMonth() + 1;

    if (values.document === "Cessão de uso de Notebook") {
      document = await cessationOfUseNotebook(
        values.employeeDetails,
        notebook.notebookBrand,
        notebook.notebookProperty,
        dataExtenso
      );
    } else if (values.document === "Termo de Entrega de Celular") {
      document = await cessationOfUsePhone(
        values.employeeDetails,
        phone.model,
        phone.value,
        phone.brand,
        phone.imei,
        phone.accessories,
        phone.state,
        dataExtenso
      );
    }

    const createdPDFDoc = await PDFDocument.load(document);
        const mergedPDF = await PDFDocument.create();
        for (const pageNum of createdPDFDoc.getPageIndices()) {
          const [page] = await mergedPDF.copyPages(createdPDFDoc, [pageNum]);
          mergedPDF.addPage(page);
        }
        const mergedPdfBytes = await mergedPDF.save();
        const blobDocument = new Blob([mergedPdfBytes], { type: "application/pdf" });

    const pdfUrl = URL.createObjectURL(blobDocument);
    window.open(pdfUrl, "_blank");
  }

  return (
    <>
      <Form.Fragment section="Dados do Serviço">
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Colaborador"
            type="text"
            name="employee"
            value={values.employee}
            onChange={handleChange}
            options={employees.map((name) => name.name)}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Select
            label="Tipo do Documento"
            type="text"
            name="document"
            value={values.document}
            onChange={handleChange}
            options={Options.Documents()}
          />
        </CustomInput.Root>
      </Form.Fragment>
      {values.document === "Cessão de uso de Notebook" && (
        <Form.Fragment section="Informações do Notebook">
          <CustomInput.Root columnSize={6}>
            <CustomInput.Input
              label="Marca do Notebook"
              type="text"
              name="notebookBrand"
              value={notebook.notebookBrand}
              onChange={handleChangeNotebook}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
            <CustomInput.Input
              label="Propriedade do Notebook"
              type="text"
              name="notebookProperty"
              value={notebook.notebookProperty}
              onChange={handleChangeNotebook}
            />
          </CustomInput.Root>
        </Form.Fragment>
      )}
      {values.document === "Termo de Entrega de Celular" && (
        <Form.Fragment section="Informações do Celular">
          <CustomInput.Root columnSize={6}>
            <CustomInput.Input
              label="Modelo do Celular"
              type="text"
              name="model"
              value={phone.model}
              onChange={handleChangePhone}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
            <CustomInput.Input
              label="Valor do Celular"
              type="text"
              name="value"
              value={phone.value}
              onChange={handleChangePhone}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
            <CustomInput.Input
              label="Marca do Celular"
              type="text"
              name="brand"
              value={phone.brand}
              onChange={handleChangePhone}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
            <CustomInput.Input
              label="IMEI do Celular"
              type="text"
              name="imei"
              value={phone.imei}
              onChange={handleChangePhone}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
            <CustomInput.Input
              label="Acessórios do Celular"
              type="text"
              name="accessories"
              value={phone.accessories}
              onChange={handleChangePhone}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
            <CustomInput.Select
              label="Estado do Celular"
              type="text"
              name="state"
              value={phone.state}
              onChange={handleChangePhone}
              options={state}
            />
          </CustomInput.Root>
        </Form.Fragment>
      )}
      <Form.Fragment section="Gerar documento">
          <Button
          name="generate"
          onClick={() => handleGenerate(values)}>
              Gerar
          </Button>
      </Form.Fragment>
    </>
  );
}
