import { Button, Upload } from "antd";
import dayjs from "dayjs";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { CustomInput } from "../../../components/input";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import ContractSignService from "../../../services/ContractSignService";
import DocumentsService from "../../../services/DocumentsService";
import Utils from "../../../services/Utils";
import {
  ClauseEight,
  ClauseFive,
  ClauseFour,
  ClauseOne,
  ClauseSeven,
  ClauseSix,
  ClauseThree,
  ClauseTwo,
} from "../../../utils/clauses/clauses";
import { Formats } from "../../../utils/formats";
import { Options } from "../../../utils/options";

export default function CreateContract() {
  VerifyUserRole(["Master", "Administrador", "Comercial"]);
  const navigate = useNavigate();
  const service = new DocumentsService();
  const contractSignService = new ContractSignService();
  const utilsService = new Utils();
  const [services, setServices] = React.useState([]);
  const [signs, setSigns] = React.useState([]);
  const [values, setValues] = React.useState({
    status: "Contrato",
    name: "",
    cpfcnpj: "",
    cep: "",
    road: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    contractNumber: "",
    date: dayjs(),
    value: "",
    index: "",
    signOnContract: null,
    servicesContract: [],
    clauses: [
      { id: 0, text: `${ClauseOne()}`, isExpanded: false },
      { id: 1, text: `${ClauseTwo()}`, isExpanded: false },
      { id: 2, text: `${ClauseThree()}`, isExpanded: false },
      { id: 3, text: `${ClauseFour()}`, isExpanded: false },
      { id: 4, text: `${ClauseFive()}`, isExpanded: false },
      { id: 5, text: `${ClauseSix()}`, isExpanded: false },
      { id: 6, text: `${ClauseSeven()}`, isExpanded: false },
      { id: 7, text: `${ClauseEight()}`, isExpanded: false },
    ],
  });

  const [file, setFile] = React.useState();

  const [selectedDescriptions, setSelectedDescriptions] = React.useState([]);
  const [selectedSignDescriptions, setSelectedSignDescriptions] =
    React.useState("");
  const [tecSign, setTecSign] = React.useState();
  const [valueMoney, setValueMoney] = React.useState("");
  const [formatCpfOrCnpj, setFormatCpfOrCnpj] = React.useState("");
  const [formatCep, setFormatCep] = React.useState("");

  const [messageError, setMessageError] = React.useState({
    name: "",
    cpfcnpj: "",
    cep: "",
    road: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    signOnContract: "",
    contractNumber: "",
    date: "",
    value: "",
    index: "",
    servicesContract: "",
  });

  React.useEffect(() => {
    const reservoirService = services.find(
      (service) => service.description.toLowerCase() === "reservatório de água"
    );

    const hasReservoirService = values.servicesContract.includes(
      reservoirService?.id
    );

    const selectedServices = services.filter((service) =>
      values.servicesContract.includes(service.id)
    );

    const selectedServiceDescriptions = selectedServices.map(
      (service) => service.description
    );

    setValues((prevValues) => ({
      ...prevValues,
      clauses: prevValues.clauses.map((clause) =>
        clause.id === 0
          ? {
              ...clause,
              text: ClauseOne(hasReservoirService, selectedServiceDescriptions),
            }
          : clause
      ),
    }));
  }, [values.servicesContract]);

  React.useEffect(() => {
    const fetchAddress = async () => {
      if (values.cep.length === 9) {
        try {
          const response = await utilsService.findCep(values.cep);
          if (response) {
            setValues((prevValues) => ({
              ...prevValues,
              road: response.data.logradouro,
              neighborhood: response.data.bairro,
              city: response.data.localidade,
              state: response.data.uf,
            }));
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchAddress();
  }, [values.cep]);

  React.useEffect(() => {
    if (values.cep.length !== 9) {
      setValues((prevValues) => ({
        ...prevValues,
        road: "",
        neighborhood: "",
        city: "",
        state: "",
      }));
    }
  }, [values.cep]);

  React.useEffect(() => {
    const Fetch = async () => {
      const valorExtenso = await utilsService.valueExtensible({
        valor: valueMoney,
      });

      setValues((prevValues) => ({
        ...prevValues,
        clauses: prevValues.clauses.map((clause) =>
          clause.id === 1
            ? {
                ...clause,
                text: ClauseTwo(
                  Formats.Money(prevValues.value),
                  valorExtenso.data
                ),
              }
            : clause
        ),
      }));
    };
    Fetch();
  }, [values.value]);

  React.useEffect(() => {
    setValues((prevValues) => ({
      ...prevValues,
      clauses: prevValues.clauses.map((clause) =>
        clause.id === 2
          ? { ...clause, text: ClauseThree(values.index) }
          : clause
      ),
    }));
  }, [values.index]);

  React.useEffect(() => {
    setValues((prevValues) => ({
      ...prevValues,
      clauses: prevValues.clauses.map((clause) =>
        clause.id === 7
          ? { ...clause, text: ClauseEight(tecSign, values.date) }
          : clause
      ),
    }));
  }, [values.signOnContract, values.date]);

  const servicesDesc = services.map((service) => service.description);
  const signSocialReason = signs.map((sign) => sign.socialReason);

  React.useEffect(() => {
    const fetchServicesAndSings = async () => {
      const dataServices = await service.getServices();
      const signService = await contractSignService.getcontractSigns();

      setTecSign(() => {
        const tecSign = signService.data.listUsers[0];
        return tecSign;
      });

      setSigns(() => {
        const updatedSigns = signService.data.listUsers.map((sign) => ({
          id: sign.id,
          socialReason: sign.socialReason,
          city: sign.city,
          state: sign.state,
        }));
        return updatedSigns;
      });

      setServices(() => {
        const updatedServices = dataServices.data.listServices.map(
          (service) => ({
            id: service.id,
            description: service.description,
          })
        );
        return updatedServices;
      });
    };

    fetchServicesAndSings();
  }, []);

  const descriptionToIdMap = services.reduce((acc, service) => {
    acc[service.description] = service.id;
    return acc;
  }, {});

  const descriptionSignToIdMap = signs.reduce((acc, service) => {
    acc[service.socialReason] = service.id;
    return acc;
  }, {});

  function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  React.useEffect(() => {
    const newSelectedIds = selectedDescriptions.map(
      (desc) => descriptionToIdMap[desc]
    );

    if (!arraysAreEqual(values.servicesContract, newSelectedIds)) {
      setValues((prevValues) => ({
        ...prevValues,
        servicesContract: newSelectedIds,
      }));
    }
  }, [selectedDescriptions]);

  React.useEffect(() => {
    const newSelectedDescription = selectedSignDescriptions;
    const newSelectedId = descriptionSignToIdMap[newSelectedDescription];

    if (values.signOnContract !== newSelectedId) {
      setValues((prevValues) => ({
        ...prevValues,
        signOnContract: newSelectedId,
      }));
    }
  }, [selectedSignDescriptions]);

  const handleAddClick = () => {
    setValues((prevContract) => ({
      ...prevContract,
      clauses: [
        ...prevContract.clauses,
        { id: Date.now(), text: "", isExpanded: false },
      ],
    }));
  };

  const handleDeleteClause = (id) => {
    setValues((prevContract) => ({
      ...prevContract,
      clauses: prevContract.clauses.filter((clause) => clause.id !== id),
    }));
  };

  const toggleExpand = (id) => {
    setValues((prevContract) => ({
      ...prevContract,
      clauses: prevContract.clauses.map((clause) =>
        clause.id === id
          ? { ...clause, isExpanded: !clause.isExpanded }
          : clause
      ),
    }));
  };

  const handleClauseChange = (id, newText) => {
    setValues((prevValues) => ({
      ...prevValues,
      clauses: prevValues.clauses.map((clause) =>
        clause.id === id ? { ...clause, text: newText } : clause
      ),
    }));
  };

  const removeMask = (maskedValue) => {
    return maskedValue.replace(/[.,]/g, "");
  };

  const handleFormatsChange = (event) => {
    const { name, value } = event.target;

    const unmaskedValue = removeMask(value);

    if (name === "cpfcnpj") {
      setValues((prevState) => ({
        ...prevState,
        [name]: Formats.CpfCnpj(value),
      }));

      setFormatCpfOrCnpj(Formats.CpfCnpj(value));
    } else if (name === "value") {
      setValues((prevState) => ({
        ...prevState,
        [name]: Formats.Money(value),
      }));

      setValueMoney(Formats.Money(value));
    } else if (name === "cep") {
      setValues((prevState) => ({
        ...prevState,
        [name]: Formats.Cep(value),
      }));

      setFormatCep(Formats.Cep(value));
    }
  };

  const handleServiceChange = (selectedDescriptions) => {
    const descriptions = selectedDescriptions.target.value;

    setSelectedDescriptions(descriptions);
  };

  const handleSignChange = (selectedDescriptions) => {
    const descriptions = selectedDescriptions.target.value;
    const tecValues = signs.filter(
      (sign) => sign.socialReason === selectedDescriptions.target.value
    );
    setTecSign(tecValues);

    setSelectedSignDescriptions(descriptions);
  };

  const handleFileChange = (e) => {
    const fileEvent = e.target.files[0];
    if (fileEvent) {
      setFile(fileEvent);
      Toast.Success(`Arquivo ${fileEvent.name} carregado com sucesso!`);
    } else {
      Toast.Error("Erro ao carregar o arquivo");
    }
  };

  const handleChange = (eventOrDate, dateString) => {
    if (eventOrDate.target) {
      const { name, value } = eventOrDate.target;

      setValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      if (value !== "") {
        setMessageError((prevState) => ({
          ...prevState,
          [name]: "",
        }));
      }
    } else {
      setValues((prevState) => ({
        ...prevState,
        date: eventOrDate ? dayjs(eventOrDate) : null,
      }));

      if (dateString !== "") {
        setMessageError((prevState) => ({
          ...prevState,
          date: "",
        }));
      }
    }
  };

  const areRequiredFieldsFilled = () => {
    const requiredFields = [
      "name",
      "cpfcnpj",
      "cep",
      "road",
      "number",
      "neighborhood",
      "city",
      "state",
      "contractNumber",
      "date",
      "value",
      "index",
      "servicesContract",
    ];
    let newErrors = {};
    let isAllFieldsFilled = true;

    for (const field of requiredFields) {
      if (!values[field]) {
        newErrors[field] = "Este campo é obrigatório";
        isAllFieldsFilled = false;
      } else {
        newErrors[field] = "";
      }
    }

    setMessageError(newErrors);
    return isAllFieldsFilled;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emptyField = areRequiredFieldsFilled();

    if (!emptyField) {
      Toast.Info("Preencha os campos obrigatórios!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const clausesToSend = values.clauses.map((clause) => ({
      description: clause.text,
    }));

    const dataToSend = {
      ...values,
      clauses: clausesToSend,
    };

    const response = await service.createContract(dataToSend);

    if (file && response) {
      formData.append("id", response.data.contract.id);
      await utilsService.uploadPDF(formData);
    }

    if (response.request.status === 500) {
      Toast.Error("Contrato já cadastrado!");
      return;
    } else {
      Toast.Success("Contrato cadastrado com sucesso!");
      navigate("/dashboard");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gerar Novo Contrato
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Contratante
              </h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <CustomInput.Input
                  label="Nome"
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  errorText={messageError.name}
                />
                <CustomInput.Input
                  label="CPF ou CNPJ"
                  type="text"
                  name="cpfcnpj"
                  value={formatCpfOrCnpj}
                  onChange={handleFormatsChange}
                  errorText={messageError.cpfcnpj}
                />
                <CustomInput.Input
                  label="CEP"
                  type="text"
                  name="cep"
                  value={formatCep}
                  onChange={handleFormatsChange}
                  errorText={messageError.cep}
                />
                <CustomInput.Input
                  label="Rua"
                  type="text"
                  name="road"
                  value={values.road}
                  onChange={handleChange}
                  errorText={messageError.road}
                />
                <CustomInput.Input
                  label="Número"
                  type="text"
                  name="number"
                  value={values.number}
                  onChange={handleChange}
                  errorText={messageError.number}
                />
                <CustomInput.Input
                  label="Complemento"
                  type="text"
                  name="complement"
                  value={values.complement}
                  onChange={handleChange}
                />
                <CustomInput.Input
                  label="Bairro"
                  type="text"
                  name="neighborhood"
                  value={values.neighborhood}
                  onChange={handleChange}
                  errorText={messageError.neighborhood}
                />
                <CustomInput.Input
                  label="Cidade"
                  type="text"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  errorText={messageError.city}
                />
                <CustomInput.Input
                  label="UF"
                  type="text"
                  name="state"
                  value={values.state}
                  onChange={handleChange}
                  errorText={messageError.state}
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Contratado
              </h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <CustomInput.Select
                label="Assinaturas"
                name="signOnContract"
                value={selectedSignDescriptions}
                options={signSocialReason}
                onChange={handleSignChange}
              />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Contrato</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <CustomInput.Input
                  label="Número"
                  type="text"
                  name="contractNumber"
                  value={values.contractNumber}
                  onChange={handleChange}
                  errorText={messageError.contractNumber}
                />
                <CustomInput.DateInput
                  label="Data"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                />
                <CustomInput.Input
                  label="Valor"
                  type="text"
                  name="value"
                  value={valueMoney}
                  onChange={handleFormatsChange}
                  errorText={messageError.value}
                />
                <CustomInput.Select
                  label="Índice"
                  type="text"
                  name="index"
                  value={values.index}
                  onChange={handleChange}
                  errorText={messageError.index}
                  options={Options.IndexContract()}
                />
              </div>
              <div className="mt-6">
                <CustomInput.Select
                  label="Serviços"
                  name="servicesContract"
                  value={selectedDescriptions}
                  onChange={handleServiceChange}
                  multiple={true}
                  options={servicesDesc}
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Cláusulas</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <Button
                onClick={handleAddClick}
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Adicionar Cláusula
              </Button>
              {values.clauses.map((clause, index) => (
                <CustomInput.LongText
                  key={clause.id}
                  label={`Cláusula Nº${index + 1}`}
                  value={clause.text}
                  isExpanded={clause.isExpanded}
                  onChange={(e) =>
                    handleClauseChange(clause.id, e.target.value)
                  }
                  onExpandToggle={() => toggleExpand(clause.id)}
                  onDelete={() => handleDeleteClause(clause.id)}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Upload
              beforeUpload={(file) => {
                handleFileChange({ target: { files: [file] } });
                return false;
              }}
              accept=".pdf"
              maxCount={1}
              showUploadList={false}
            >
              <Button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                Anexar Proposta
              </Button>
            </Upload>
            <div>
              <Button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-4"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Criar Contrato
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
