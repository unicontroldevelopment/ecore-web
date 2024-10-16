import * as React from "react";
import { useNavigate } from "react-router-dom";

import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import Loading from "../../../components/animations/Loading";
import { Filter } from "../../../components/filter";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input";
import { Table } from "../../../components/table";
import { ActionsContainer } from "../../../components/table/styles";
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
      // Filtro por nome
      const nameMatch = contract.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
  
      // Filtro por franquia
      const franchiseMatch = contract.signOnContract &&
        contract.signOnContract.some((signature) =>
          signature.Contract_Signature &&
          signature.Contract_Signature.socialReason &&
          signature.Contract_Signature.socialReason
            .toLowerCase()
            .includes(filters.franchise.toLowerCase())
        );
  
      // Retorna true se todos os filtros aplicáveis forem satisfeitos
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

  const handleButtonClick = (contract) => {
    setSelectContract((prevContract) => ({ ...prevContract, ...contract }));
    navigate(`/documents/${contract.id}/additive-reajustments`);
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

  const options = [
    {
      title: "Cliente",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "CPF/CNPJ",
      dataIndex: "cpfcnpj",
      key: "cpfcnpj",
    },
    {
      title: "Aditivos e Reajustes",
      key: "actions",
      width: 150,
      render: (text, record) => (
        <ActionsContainer>
          <Button
            title="Aditivo/Reajuste"
            style={{ backgroundColor: "#FF7F50", color: "#fff" }}
            shape="circle"
            onClick={() => handleButtonClick(record)}
            icon={<EllipsisOutlined />}
          />
        </ActionsContainer>
      ),
    },
  ];

  return (
    <>
      {loading && <Loading />}
      <Table.Root title="Lista de Clientes Sem Contrato">
        <Button
          type="primary"
          onClick={() => setModalCreate(true)}
          style={{ marginLeft: "88%" }}
        >
          Adicionar Cliente
        </Button>
        <Filter.Fragment section="Filtro">
          <CustomInput.Root columnSize={18}>
            <Filter.FilterInput
              label="Nome do Cliente"
              name="name"
              onChange={handleChangeFilter}
              value={filter.name}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={6}>
            <Filter.Select
              label="Franquia"
              name="franchise"
              onChange={handleChangeFilter}
              value={filter.franchise}
              options={signs.map((sign) => sign.socialReason)}
            />
          </CustomInput.Root>
        </Filter.Fragment>
        <Table.Table
          data={contracts}
          columns={options}
          onView={handleView}
          onUpdate={handleUpdate}
          confirm={confirmDelete}
          cancel={cancelDelete}
        />
      </Table.Root>
      {modalCreate && (
        <Modal
          title={`Adicionar novo Cliente`}
          open={modalCreate}
          centered
          width={800}
          onCancel={() => setModalCreate(false)}
          footer={[
            <Button key="back" onClick={() => setModalCreate(false)}>
              Voltar
            </Button>,
            <Button key="submit" type="primary" onClick={handleCreate}>
              Adicionar
            </Button>,
          ]}
        >
          <Form.Fragment section="Dados">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Nome"
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                errorText={messageError.name}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="CPF ou CNPJ"
                type="text"
                name="cpfcnpj"
                value={formatCpfOrCnpj}
                onChange={handleFormatsChange}
                errorText={messageError.cpfcnpj}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="CEP"
                type="text"
                name="cep"
                value={formatCep}
                onChange={handleFormatsChange}
                errorText={messageError.cep}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Rua"
                type="text"
                name="road"
                value={values.road}
                onChange={handleChange}
                errorText={messageError.road}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={3}>
              <CustomInput.Input
                label="Número"
                type="text"
                name="number"
                value={values.number}
                onChange={handleChange}
                errorText={messageError.number}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={3}>
              <CustomInput.Input
                label="Complemento"
                type="text"
                name="neighborhood"
                value={values.complement}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Bairro"
                type="text"
                name="neighborhood"
                value={values.neighborhood}
                onChange={handleChange}
                errorText={messageError.neighborhood}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Cidade"
                type="text"
                name="city"
                value={values.city}
                onChange={handleChange}
                errorText={messageError.city}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="UF"
                type="text"
                name="state"
                value={values.state}
                onChange={handleChange}
                errorText={messageError.state}
              />
            </CustomInput.Root>
          </Form.Fragment>
          <Form.Fragment section="Franquia">
            <CustomInput.Select
              label="Assinaturas"
              name="signOnContract"
              value={values.signOnContract[0]?.Contract_Signature.socialReason}
              options={signs.map((sign) => sign.socialReason)}
              onChange={handleSignChangeCreate}
            />
          </Form.Fragment>
        </Modal>
      )}
      {isModalVisibleUpdate && (
        <Modal
          title="Editar Cliente"
          open={isModalVisibleUpdate}
          centered
          style={{ top: 20 }}
          onCancel={() => {
            setIsModalVisibleUpdate(false);
          }}
          width={1200}
          footer={[
            <Button
              key="submit"
              type="primary"
              onClick={() => confirmUpdate(selectContract)}
            >
              Atualizar
            </Button>,
            <Button
              key="back"
              onClick={() => {
                setIsModalVisibleUpdate(false);
              }}
            >
              Voltar
            </Button>,
          ]}
        >
          <Form.Fragment section="Contratante">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Nome"
                type="text"
                name="name"
                value={selectContract.name}
                onChange={handleChangeUpdate}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="CPF ou CNPJ"
                type="text"
                name="cpfcnpj"
                value={selectContract.cpfcnpj}
                onChange={handleFormatsChangeUpdate}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="CEP"
                type="text"
                name="cep"
                value={selectContract.cep}
                onChange={handleFormatsChangeUpdate}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Rua"
                type="text"
                name="road"
                value={selectContract.road}
                onChange={handleChangeUpdate}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={3}>
              <CustomInput.Input
                label="Número"
                type="text"
                name="number"
                value={selectContract.number}
                onChange={handleChangeUpdate}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={3}>
              <CustomInput.Input
                label="Complemento"
                type="text"
                name="complement"
                value={selectContract.complement}
                onChange={handleChangeUpdate}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Bairro"
                type="text"
                name="neighborhood"
                value={selectContract.neighborhood}
                onChange={handleChangeUpdate}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Cidade"
                type="text"
                name="city"
                value={selectContract.city}
                onChange={handleChangeUpdate}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="UF"
                type="text"
                name="state"
                value={selectContract.state}
                onChange={handleChangeUpdate}
              />
            </CustomInput.Root>
          </Form.Fragment>
          <Form.Fragment section="Franquia">
            <CustomInput.Select
              label="Assinaturas"
              name="signOnContract"
              value={
                selectContract.signOnContract[0].Contract_Signature.socialReason
              }
              options={signs.map((sign) => sign.socialReason)}
              onChange={handleSignChange}
            />
          </Form.Fragment>
        </Modal>
      )}
    </>
  );
}
