import * as React from "react";

import { Button } from "antd";
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import localeData from 'dayjs/plugin/localeData';
import { PDFDocument } from "pdf-lib";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import EmployeeService from "../../../services/EmployeeService";
import { Formats } from "../../../utils/formats";
import { Options } from "../../../utils/options";
import { adhesionTermPPO } from "../../../utils/pdf/documents/adhesionTermPPO";
import { cessationOfUseNotebook } from "../../../utils/pdf/documents/cessationOfUseNotebook";
import { cessationOfUsePhone } from "../../../utils/pdf/documents/cessationOfUsePhone";
import { currentAccount } from "../../../utils/pdf/documents/currentAccount";
import { disciplinaryWarining } from "../../../utils/pdf/documents/disciplinaryWarning";
import { discountAuthorization } from "../../../utils/pdf/documents/discountAuthorization";
import { experienceContract } from "../../../utils/pdf/documents/experienceContract";
import { knowledgeOfMonitoring } from "../../../utils/pdf/documents/knowledgeOfMonitoring";
import { renouncesVT } from "../../../utils/pdf/documents/renouncesVT";
import { termOfCardTEU } from "../../../utils/pdf/documents/termOfCardTEU";
import { termOfProrrogation } from "../../../utils/pdf/documents/termOfProrogation";

dayjs.extend(localeData);
dayjs.locale('pt-br');

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
  });
  const [date, setDate] = React.useState();
  const [currentAccountData, setCurrentAccountData] = React.useState({
    sign: "",
  });
  const [notebook, setNotebook] = React.useState({
    notebookBrand: "",
    notebookProperty: "",
  });
  const [warning, setWarning] = React.useState({
    attestant_01: "",
    attestant_02: "",
    cpf_01: "",
    cpf_02: "",
    reason: "",
  });
  const [teu, setTeu] = React.useState({
    number: "",
    value: "",
  });

  const state = ["Novo", "Usado"];

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
        const selectedEmployee = employees.find((emp) => emp.name === value);
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

  const handleChangeWarning = (event) => {
    const { name, value } = event.target;

    if (name === "cpf_01") {
      setWarning((prevState) => {
        const updatedValues = {
          ...prevState,
          [name]: Formats.CpfCnpj(value),
        };

        return updatedValues;
      });
    } else if (name === "cpf_02") {
      setWarning((prevState) => {
        const updatedValues = {
          ...prevState,
          [name]: Formats.CpfCnpj(value),
        };

        return updatedValues;
      });
    } else {
      setWarning((prevState) => {
        const updatedValues = {
          ...prevState,
          [name]: value,
        };

        return updatedValues;
      });
    }
  };

  const handleSign = (event) => {
    const { name, value } = event.target

    setCurrentAccountData((prevState) => {
      const updatedValues = {
        ...prevState,
        [name]: value,
      };

      return updatedValues;
    })
  }

  const handleChangeTEU = (event) => {
    const { name, value } = event.target;

    if (name === "value") {
      setTeu((prevState) => {
        const updatedValues = {
          ...prevState,
          [name]: Formats.Money(value),
        };

        return updatedValues;
      });
    } else {
      setTeu((prevState) => {
        const updatedValues = {
          ...prevState,
          [name]: value,
        };

        return updatedValues;
      });
    }
  };

  const handleDate = (e) => {
      const selectedDate = dayjs(e);    
      setDate(selectedDate);
  };

  const handleGenerate = async () => {
    let document;
    const dateObj = dayjs(date).toDate()
    const extenseDate = new Date().getMonth() + 1;

    if (values.document === "Cessão de uso de Notebook") {
      document = await cessationOfUseNotebook(
        values.employeeDetails,
        notebook.notebookBrand,
        notebook.notebookProperty,
        dateObj
      );
    } else if (values.document === "Termo de Entrega de Celular") {
      document = await cessationOfUsePhone(
        values.employeeDetails,
        phone,
        dateObj
      );
    } else if (values.document === "Advertência Disciplinar") {
      document = await disciplinaryWarining(
        values.employeeDetails,
        warning,
        dateObj
      );
    } else if (values.document === "Autorização Desconto") {
      document = await discountAuthorization(values.employeeDetails);
    } else if (values.document === "Abertura de Conta Corrente") {
      document = await currentAccount(values.employeeDetails,currentAccountData.sign, dateObj);
    } else if (values.document === "Declaração de Renúncia VT") {
      document = await renouncesVT(values.employeeDetails);
    } else if (values.document === "Termo Adesão PPO") {
      if (
        values.employeeDetails.company ===
        "NEWSIS SISTEMAS E SERVIÇOS DE INTERNET LTDA"
      ) {
        Toast.Error(
          "Apenas funcionários da Unicontrol podem gerar o termo de adesão PPO"
        );
        return false;
      } else if (
        values.employeeDetails.company === "UNICONTROL CONTROLE DE PRAGAS LTDA"
      ) {
        document = await adhesionTermPPO(values.employeeDetails);
      } else if (
        values.employeeDetails.company ===
        "FITOLOG LICENCIAMENTO DE FRANQUIAS LTDA"
      ) {
        Toast.Error(
          "Apenas funcionários da Unicontrol podem gerar o termo de adesão PPO"
        );
        return false;
      } else {
        document = await adhesionTermPPO(values.employeeDetails);
      }
    } else if (values.document === "Termo de Ciência de Monitoramento") {
      document = await knowledgeOfMonitoring(values.employeeDetails);
    } else if (values.document === "Termo de Responsabilidade TEU") {
      document = await termOfCardTEU(values.employeeDetails, teu, dateObj);
    } else if (values.document === "Contrato Expêriencia não vendedor") {
      document = await experienceContract(values.employeeDetails)
    } else if (values.document === "Termo de Prorrogação") {
      document = await termOfProrrogation(values.employeeDetails)
    } else {
      Toast.Error("Documento não encontrado")
      return;
    }

    const createdPDFDoc = await PDFDocument.load(document);
    const mergedPDF = await PDFDocument.create();
    mergedPDF.setTitle(`${values.document} - ${values.employeeDetails.name}`);
    for (const pageNum of createdPDFDoc.getPageIndices()) {
      const [page] = await mergedPDF.copyPages(createdPDFDoc, [pageNum]);
      mergedPDF.addPage(page);
    }
    const mergedPdfBytes = await mergedPDF.save();
    const blobDocument = new Blob([mergedPdfBytes], {
      name: "teste",
      type: "application/pdf",
    });

    const pdfUrl = URL.createObjectURL(blobDocument);

    window.open(pdfUrl, "_blank");
  };

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
          <CustomInput.Root columnSize={6}>
          <CustomInput.DateInput
            label="Data"
            value={date}
            onChange={handleDate}
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
          <CustomInput.Root columnSize={6}>
          <CustomInput.DateInput
            label="Data"
            value={date}
            onChange={handleDate}
          />
        </CustomInput.Root>
        </Form.Fragment>
      )}
      {values.document === "Advertência Disciplinar" && (
        <Form.Fragment section="Informações da Advertência">
          <CustomInput.Root columnSize={6}>
            <CustomInput.Input
              label="Primeira Testemunha"
              type="text"
              name="attestant_01"
              value={warning.attestant_01}
              onChange={handleChangeWarning}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
            <CustomInput.Input
              label="CPF da Primeira Testemunha"
              type="text"
              name="cpf_01"
              value={warning.cpf_01}
              onChange={handleChangeWarning}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
            <CustomInput.Input
              label="Segunda Testemunha"
              type="text"
              name="attestant_02"
              value={warning.attestant_02}
              onChange={handleChangeWarning}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
            <CustomInput.Input
              label="CPF da Segunda Testemunha"
              type="text"
              name="cpf_02"
              value={warning.cpf_02}
              onChange={handleChangeWarning}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={24}>
            <CustomInput.LongInput
              label="Motivo da Advertencia"
              type="text"
              name="reason"
              value={warning.reason}
              onChange={handleChangeWarning}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
          <CustomInput.DateInput
            label="Data"
            value={date}
            onChange={handleDate}
          />
        </CustomInput.Root>
        </Form.Fragment>
      )}
      {values.document === "Termo de Responsabilidade TEU" && (
        <Form.Fragment section="Informações do Cartão">
          <CustomInput.Root columnSize={6}>
            <CustomInput.Input
              label="Número do cartão TEU"
              type="text"
              name="number"
              value={teu.number}
              onChange={handleChangeTEU}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
            <CustomInput.Input
              label="Valor em caso de perde ou dano injustificável"
              type="text"
              name="value"
              value={teu.value}
              onChange={handleChangeTEU}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
          <CustomInput.DateInput
            label="Data"
            value={date}
            onChange={handleDate}
          />
        </CustomInput.Root>
        </Form.Fragment>
      )}
      {values.document === "Abertura de Conta Corrente" && (
        <Form.Fragment section="Informações da Assinatura">
          <CustomInput.Root columnSize={6}>
            <CustomInput.Select
              label="Assinatura"
              type="text"
              name="sign"
              value={currentAccountData.sign}
              onChange={handleSign}
              options={Options.SignDocument()}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
          <CustomInput.DateInput
            label="Data"
            value={date}
            onChange={handleDate}
          />
        </CustomInput.Root>
        </Form.Fragment>
      )}
      <Form.Fragment section="Gerar documento">
        <Button name="generate" onClick={() => handleGenerate(values)}>
          Gerar
        </Button>
      </Form.Fragment>
    </>
  );
}
