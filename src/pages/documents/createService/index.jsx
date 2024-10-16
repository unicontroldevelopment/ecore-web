import * as React from "react";
import { useNavigate } from "react-router-dom";

import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Popconfirm } from "antd";
import Loading from "../../../components/animations/Loading";
import { Filter } from "../../../components/filter";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input";
import { Table } from "../../../components/table";
import { ActionsContainer } from "../../../components/table/styles";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import DocumentsService from "../../../services/DocumentsService";

export default function CreateService() {
  VerifyUserRole(["Master", "Administrador", "Comercial"]);
  const navigate = useNavigate();
  const service = new DocumentsService();
  const [dataServices, setDataServices] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectService, setSelectService] = React.useState({});
  const [editModal, setEditModal] = React.useState(false);
  const [filter, setFilter] = React.useState({
    name: "",
  });
  const [createServiceModal, setCreateServiceModal] = React.useState(false);
  const [values, setValues] = React.useState({
    description: "",
    code: "",
  });

  const fetchServices = async () => {
    try {
      const response = await service.getServices();

      setDataServices(response.data.listServices);
      setServices(response.data.listServices);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchServices()]);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const filteredServices = dataServices.filter((service) => {
      const matchesName = service.description
        .toLowerCase()
        .includes(filter.name.toLowerCase());
      return matchesName;
    });

    setServices(filteredServices);
  }, [filter.name]);

  const [messageError, setMessageError] = React.useState({
    description: "",
    code: "",
  });

  const handleChange = (event) => {
    setValues((prevState) => {
      const updatedValues = {
        ...prevState,
        [event.target.name]: event.target.value,
      };
      return updatedValues;
    });

    if (event.target.value !== "") {
      setMessageError((prevState) => ({
        ...prevState,
        [event.target.name]: "",
      }));
    }
  };

  const handleUpdateChange = (event) => {
    setSelectService((prevState) => {
      const updatedValues = {
        ...prevState,
        [event.target.name]: event.target.value,
      };
      return updatedValues;
    });
  };

  const areRequiredFieldsFilled = () => {
    const requiredFields = ["description"];
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
    const emptyField = areRequiredFieldsFilled();

    if (!emptyField) {
      Toast.Info("Preencha os campos obrigatórios!");
      return;
    }

    const response = await service.createService(values);

    if (response.request.status === 500) {
      Toast.Error("Serviço já cadastrado!");
      return;
    } else {
      Toast.Success("Serviço cadastrado com sucesso!");
      await fetchServices();
    }
  };

  const handleUpdate = async (updateData) => {
    try {
      setLoading(true);

      const response = await service.updateService(updateData.id, updateData);

      Toast.Success("Serviço atualizado com sucesso!");
      setEditModal(false);
      setLoading(false);
      await fetchServices();
      return response;
    } catch (error) {
      Toast.Error(error);
      setLoading(false);
      return error;
    }
  };

  const handleDelete = async (e) => {
    try {
      const response = await service.deleteService(e.id);

      if (response.status === 200) {
        setDataServices(dataServices.filter((service) => service.id !== e.id));

        Toast.Success("Serviço deletado com sucesso!");
      }
      return response;
    } catch (error) {
      Toast.Error("Erro ao deletar serviço");
      return error;
    }
  };

  const handleEdit = (service) => {
    setSelectService(service);
    setEditModal(true);
  };

  const handleChangeFilter = (event) => {
    setFilter((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleRegister = () => {
    setCreateServiceModal(true);
  };

  const handleCancel = () => {
    return;
  };

  const columns = [
    {
      title: "Serviço",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description)
    },
    {
      title: "Codigo Newsis",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code - b.code,
    },
    {
      title: "Opções",
      key: "actions",
      width: 150,
      render: (text, record) => (
        <ActionsContainer>
          <Button
            title="Editar"
            style={{ backgroundColor: "#36db6a", color: "#fff" }}
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Tem certeza?"
            description="Você quer deletar este serviço?"
            onConfirm={() => handleDelete(record)}
            onCancel={() => handleCancel(record)}
            okText="Sim"
            cancelText="Não"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              title="Deletar"
              style={{ backgroundColor: "#da4444", color: "#fff" }}
              icon={<DeleteOutlined />}
              shape="circle"
            />
          </Popconfirm>
        </ActionsContainer>
      ),
    },
  ];

  return (
    <>
      {loading && <Loading />}
      <Table.Root title="Lista de Serviços">
        <Filter.Fragment section="Filtros">
          <CustomInput.Root columnSize={6}>
            <Filter.FilterInput
              label="Nome"
              name="name"
              value={filter.name}
              onChange={handleChangeFilter}
            />
          </CustomInput.Root>
          <CustomInput.Root columnSize={12}>
            <Filter.Button label="Novo Serviço" onClick={handleRegister} />
          </CustomInput.Root>
        </Filter.Fragment>
        <Table.TableClean columns={columns} data={services} pagination />
        {createServiceModal && (
          <Modal
            title="Criar novo serviço"
            open={createServiceModal}
            centered
            width={500}
            onCancel={() => setCreateServiceModal(false)}
            footer={[
              <Button
                key="register"
                style={{
                  backgroundColor: "#4168b0",
                  color: "white",
                }}
                onClick={() => handleSubmit()}
              >
                Cadastrar
              </Button>,
              <Button key="back" onClick={() => setCreateServiceModal(false)}>
                Voltar
              </Button>,
            ]}
          >
            <Form.Fragment section="Dados do Serviço">
              <CustomInput.Root columnSize={12}>
                <CustomInput.Input
                  label="Tipo de Serviço"
                  type="text"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  errorText={messageError.description}
                />
              </CustomInput.Root>
              <CustomInput.Root columnSize={12}>
                <CustomInput.Input
                  label="Código Newsis"
                  type="text"
                  name="code"
                  value={values.code}
                  onChange={handleChange}
                  errorText={messageError.code}
                />
              </CustomInput.Root>
            </Form.Fragment>
          </Modal>
        )}
        {editModal && (
          <Modal
            title="Editar serviço"
            open={editModal}
            centered
            width={500}
            onCancel={() => setEditModal(false)}
            footer={[
              <Button
                key="register"
                style={{
                  backgroundColor: "#4168b0",
                  color: "white",
                }}
                onClick={() => handleUpdate(selectService)}
              >
                Atualizar
              </Button>,
              <Button key="back" onClick={() => setEditModal(false)}>
                Voltar
              </Button>,
            ]}
          >
            <Form.Fragment section="Dados do Serviço">
              <CustomInput.Root columnSize={12}>
                <CustomInput.Input
                  label="Tipo de Serviço"
                  type="text"
                  name="description"
                  value={selectService.description}
                  onChange={handleUpdateChange}
                  errorText={messageError.description}
                />
              </CustomInput.Root>
              <CustomInput.Root columnSize={12}>
                <CustomInput.Input
                  label="Código Newsis"
                  type="text"
                  name="code"
                  value={selectService.code}
                  onChange={handleUpdateChange}
                  errorText={messageError.code}
                />
              </CustomInput.Root>
            </Form.Fragment>
          </Modal>
        )}
      </Table.Root>
    </>
  );
}
