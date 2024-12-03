import * as React from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../../../components/animations/Loading";
import ClientTable from "../../../components/manage-clients/ClientTable";
import CreateModalClient from "../../../components/manage-clients/CreateModalClient";
import EditModalClient from "../../../components/manage-clients/EditModalClient";
import FilterComponent from "../../../components/manage-clients/FilterComponent";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import ContractSignService from "../../../services/ContractSignService";
import DocumentsService from "../../../services/DocumentsService";
import Utils from "../../../services/Utils";
import { Formats } from "../../../utils/formats";

export default function LooseAdditive() {
  VerifyUserRole(["Master", "Administrador", "Comercial"]);
  const navigate = useNavigate();
  const utilsService = new Utils();
  const contractService = new ContractSignService();
  const service = new DocumentsService();

  const [allContracts, setAllContracts] = React.useState([]);
  const [contracts, setContracts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [signs, setSigns] = React.useState([]);
  const [modalCreate, setModalCreate] = React.useState(false);
  const [formatCpfOrCnpj, setFormatCpfOrCnpj] = React.useState("");
  const [formatCep, setFormatCep] = React.useState("");
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = React.useState(false);
  const [selectContract, setSelectContract] = React.useState({
    id: "",
    status: "Avulso",
    d4sign: "",
    name: "",
    cpfcnpj: "",
    cep: "",
    road: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [values, setValues] = React.useState({
    status: "Avulso",
    name: "",
    cpfcnpj: "",
    cep: "",
    road: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    signOnContract: [
      {
        contract_id: "",
        sign_id: "",
        Contract_Signature: { socialReason: "" },
      },
    ],
  });
  const [filter, setFilter] = React.useState({
    name: "",
    franchise: "",
    type: "Avulso",
  });

  const [messageError, setMessageError] = React.useState({
    name: "",
    cpfcnpj: "",
    cep: "",
    road: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  //Fetchs -------------------------------------------------------------------------------------
  const fetchContracts = async (
    nameFilter = "",
    isLoadingControlled = false
  ) => {
    if (isLoadingControlled) setLoading(true);
    try {
      const request = await service.getContracts(nameFilter, filter.type);
      const dataContracts = request.data.listContracts;

      setAllContracts(dataContracts);
      setContracts(dataContracts);
      if (isLoadingControlled) setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar contratos:", error);
      if (isLoadingControlled) setLoading(false);
    }
  };

  const fetchSigns = async () => {
    try {
      const signService = await contractService.getcontractSigns();
      setSigns(signService.data.listUsers);
    } catch (error) {
      console.error("Erro ao buscar assinaturas:", error);
    }
  };

  const applyFilters = (contracts, filters) => {
    return contracts.filter((contract) => {
      const nameMatch = contract.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());

      const franchiseMatch =
        contract.signOnContract &&
        contract.signOnContract.some(
          (signature) =>
            signature.Contract_Signature &&
            signature.Contract_Signature.socialReason &&
            signature.Contract_Signature.socialReason
              .toLowerCase()
              .includes(filters.franchise.toLowerCase())
        );

      return nameMatch && (filters.franchise ? franchiseMatch : true);
    });
  };

  //Effect -------------------------------------------------------------------------------------------
  React.useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchContracts("", true), fetchSigns()]);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const filteredContracts = applyFilters(allContracts, filter);
    setContracts(filteredContracts);
  }, [filter, allContracts]);

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
    const fetchAddress = async () => {
      if (selectContract.cep.length === 9) {
        try {
          const response = await utilsService.findCep(selectContract.cep);
          if (response) {
            setSelectContract((prevValues) => ({
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
  }, [selectContract.cep]);

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

  const handleClearFilters = () => {
    setFilter((prevFilter) => ({ ...prevFilter, name: "", franchise: "" }));
  };

  const handleSignChange = (event) => {
    const { value } = event.target;

    setSelectContract((prevState) => {
      const currentTecSocialReason =
        prevState.signOnContract[0].Contract_Signature.socialReason;

      if (value !== currentTecSocialReason) {
        const selectedTec = signs.find((sign) => sign.socialReason === value);
        return {
          ...prevState,
          signOnContract: [
            {
              contract_id: prevState.id,
              sign_id: selectedTec.id,
              Contract_Signature: { ...selectedTec },
            },
          ],
        };
      }
      return prevState;
    });
  };

  const handleSignChangeCreate = (event) => {
    const { value } = event.target;

    setValues((prevState) => {
      const currentTecSocialReason =
        prevState.signOnContract[0]?.Contract_Signature.socialReason;

      if (!currentTecSocialReason) {
        const selectedTec = signs.find((sign) => sign.socialReason === value);
        return {
          ...prevState,
          signOnContract: [
            {
              contract_id: prevState.id,
              sign_id: selectedTec.id,
              Contract_Signature: { ...selectedTec },
            },
          ],
        };
      }

      if (value !== currentTecSocialReason) {
        const selectedTec = signs.find((sign) => sign.socialReason === value);
        return {
          ...prevState,
          signOnContract: [
            {
              contract_id: prevState.id,
              sign_id: selectedTec.id,
              Contract_Signature: { ...selectedTec },
            },
          ],
        };
      }
      return prevState;
    });
  };

  const handleFormatsChange = (event) => {
    const { name, value } = event.target;

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

  const handleFormatsChangeUpdate = (event) => {
    const { name, value } = event.target;

    if (name === "cpfcnpj") {
      setSelectContract((prevState) => ({
        ...prevState,
        [name]: Formats.CpfCnpj(value),
      }));

      setFormatCpfOrCnpj(Formats.CpfCnpj(value));
    } else if (name === "value") {
      setSelectContract((prevState) => ({
        ...prevState,
        [name]: Formats.Money(value),
      }));

      setValueMoney(Formats.Money(value));
    } else if (name === "cep") {
      setSelectContract((prevState) => ({
        ...prevState,
        [name]: Formats.Cep(value),
      }));

      setFormatCep(Formats.Cep(value));
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

  const handleChangeUpdate = (eventOrDate, dateString) => {
    if (eventOrDate.target) {
      const { name, value } = eventOrDate.target;

      setSelectContract((prevState) => ({
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
      setSelectContract((prevState) => ({
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

  const handleChangeFilter = (event) => {
    setFilter((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
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

  const areRequiredFieldsFilledUpdate = () => {
    const requiredFields = [
      "name",
      "cpfcnpj",
      "cep",
      "road",
      "number",
      "neighborhood",
      "city",
      "state",
    ];
    let newErrors = {};
    let isAllFieldsFilled = true;

    for (const field of requiredFields) {
      if (!selectContract[field]) {
        newErrors[field] = "Este campo é obrigatório";
        isAllFieldsFilled = false;
      } else {
        newErrors[field] = "";
      }
    }

    setMessageError(newErrors);
    return isAllFieldsFilled;
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const emptyField = areRequiredFieldsFilled();

    if (!emptyField) {
      Toast.Info("Preencha os campos obrigatórios!");
      return;
    }

    const signId = values.signOnContract?.[0]?.sign_id;

    if (!signId) {
      Toast.Info("Selecione uma franquia!");
      return;
    }

    const data = {
      ...values,
      signOnContract: signId,
    };

    const response = await service.createCustomer(data);

    if (response.request.status === 500) {
      Toast.Error("Cliente já cadastrado!");
      return;
    } else {
      await fetchContracts("", true);
      setModalCreate(false);
      Toast.Success("Cliente cadastrado com sucesso!");
    }
  };

  const handleButtonClick = (contract, type) => {
    setSelectContract((prevContract) => ({ ...prevContract, ...contract }));
    
    if (type === 'aditivo') {
      navigate(`/documents/${contract.id}/additive-reajustments`);
    } else if (type === 'minuta') {
      navigate(`/documents/${contract.id}/drafts`);
    }
  };

  const handleView = () => {
    return;
  };

  const handleUpdate = (event) => {
    setSelectContract(event);
    setIsModalVisibleUpdate(true);
  };

  const confirmDelete = async (e) => {
    try {
      const response = await service.deleteContract(e.id);

      if (response.status === 200) {
        setContracts(contracts.filter((contract) => contract.id !== e.id));

        Toast.Success("Cliente deletado com sucesso!");
      }
      return response;
    } catch (error) {
      Toast.Error("Erro ao deletar cliente");
      return error;
    }
  };

  const cancelDelete = () => {
    return;
  };

  const confirmUpdate = async (updateData) => {
    try {
      setLoading(true);
      const emptyField = areRequiredFieldsFilledUpdate();

      if (!emptyField) {
        Toast.Info(
          "Preencha todos os campos obrigatórios, somente complemento não é necessário!"
        );
        return;
      }

      const response = await service.updateContract(updateData.id, updateData);

      if (response.status === 200) {
        await fetchContracts("", true);
        Toast.Success("Cliente atualizado com sucesso!");
        setIsModalVisibleUpdate(false);
      }
      setLoading(false);
      return response;
    } catch (error) {
      Toast.Error(error);
      setLoading(false);
      return error;
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Lista de Clientes Sem Contrato
        </h1>
        {loading && <Loading />}
        <FilterComponent
          filter={filter}
          onFilterChange={handleChangeFilter}
          onClearFilters={handleClearFilters}
          onModalCreate={setModalCreate}
          signs={signs}
        />
        <ClientTable
          contracts={contracts}
          onView={handleView}
          onUpdate={handleUpdate}
          confirm={confirmDelete}
          cancel={cancelDelete}
          handleButtonClick={handleButtonClick}
        />
        <CreateModalClient
          isVisible={modalCreate}
          onClose={setModalCreate}
          onCreate={handleCreate}
          contract={values}
          handleChange={handleChange}
          handleFormatChange={handleFormatsChange}
          handleSignChange={handleSignChangeCreate}
          signs={signs}
          formatCpfOrCnpj={formatCpfOrCnpj}
          formatCep={formatCep}
        />
        <EditModalClient 
          isVisible={isModalVisibleUpdate}
          onClose={setIsModalVisibleUpdate}
          onUpdate={confirmUpdate}
          contract={selectContract}
          signs={signs}
          handleChangeUpdate={handleChangeUpdate}
          handleSignChange={handleSignChange}
          handleFormatsChangeUpdate={handleFormatsChangeUpdate}
        />
      </div>
    </>
  );
}
