/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal } from "antd";
import dayjs from "dayjs";
import * as React from "react";
import { Filter } from "../../../components/filter";
import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input/index";
import { CustomModal } from "../../../components/modal";
import { Table } from "../../../components/table";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import EmployeeService from "../../../services/EmployeeService";
import { Options } from "../../../utils/options";

export default function ListEmployee() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const [users, setUsers] = React.useState([]);
  const [selectUser, setSelectUser] = React.useState({
    name: "",
    birthday: dayjs(),
    cpf: "",
    ctps: "",
    serie: "",
    office: "",
    cbo: "",
    education: "",
    maritalStatus: "",
    nationality: "",
    pis: "",
    rg: "",
    cep: "",
    road: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    level: "",
    department: "",
    company: "",
    costCenter: "",
    dateAdmission: dayjs(),
    dateResignation: null,
    initialWage: "",
    currentWage: "",
  });
  const [isModalVisibleView, setIsModalVisibleView] = React.useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = React.useState(false);
  const [filter, setFilter] = React.useState({
    name: "",
    office: "",
  });

  const service = new EmployeeService();

  React.useEffect(() => {
    const fetchUsers = async () => {
      const request = await service.getEmployees(filter.name, filter.office);
      setUsers(request.data.listUsers);
    };
    fetchUsers();
  }, [filter]);

  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const handleChange = (event) => {
    setSelectUser((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleChangeFilter = (event) => {
    setFilter((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleDateAdmission = (event) => {
    setSelectUser((prevState) => ({
      ...prevState,
      dateAdmission: event ? dayjs(event) : null,
    }));
  };

  const handleDateResignation = (event) => {
    setSelectUser((prevState) => ({
      ...prevState,
      dateResignation: event ? dayjs(event) : null,
    }));
  };

  const confirmDelete = async (e) => {
    try {
      const response = await service.delete(e.id);

      if (response.status === 200) {
        setUsers(users.filter((user) => user.id !== e.id));

        Toast.Success("Funcionário deletado com sucesso!");
      }
      return response;
    } catch (error) {
      return error;
    }
  };
  const cancelDelete = () => {
    return;
  };

  const confirmUpdate = async (updateData) => {
    try {
      const response = await service.update(updateData.id, updateData);

      if (response.status === 200) {
        const updatedData = users.map((user) =>
          user.id === updateData.id ? { ...user, ...updateData } : user
        );

        setUsers(updatedData);
        Toast.Success("Funcionário atualizado com sucesso!");

        setIsModalVisibleUpdate(false);
      }

      return response;
    } catch (error) {
      return error;
    }
  };

  const handleUpdate = (user) => {
    setSelectUser(user);
    setIsModalVisibleUpdate(true);
  };

  const handleView = (user) => {
    const formattedUser = {
      ...user,
      birthday: formatDate(user.birthday),
    };

    setSelectUser(formattedUser);
    setIsModalVisibleView(true);
  };

  const options = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
  ];

  return (
    <Table.Root title="Lista de funcionários" columnSize={12}>
      <Filter.Fragment section="Filtros">
        <CustomInput.Root columnSize={6}>
          <Filter.FilterInput
            label="Nome"
            name="name"
            value={filter.name}
            onChange={handleChangeFilter}
          />
        </CustomInput.Root>

        <CustomInput.Root columnSize={6}>
          <Filter.Select
            label="Cargo"
            name="office"
            value={filter.office}
            onChange={handleChangeFilter}
            options={Options.Office()}
          />
        </CustomInput.Root>
      </Filter.Fragment>
      <Table.Table
        data={users}
        columns={options}
        onView={handleView}
        onUpdate={handleUpdate}
        confirm={confirmDelete}
        cancel={cancelDelete}
      />
      {isModalVisibleView && (
        <Modal
          title="Detalhes do Funcionário"
          open={isModalVisibleView}
          centered
          width={1000}
          onCancel={() => setIsModalVisibleView(false)}
          footer={[
            <Button key="back" onClick={() => setIsModalVisibleView(false)}>
              Voltar
            </Button>,
          ]}
        >
          <CustomModal.Info label="Nome" value={selectUser.name} />
          <CustomModal.Info
            label="Data de Nascimento"
            value={selectUser.birthday}
          />
          <CustomModal.Info label="CPF" value={selectUser.cpf} />
          <CustomModal.Info label="CTPS" value={selectUser.ctps} />
          <CustomModal.Info label="Série" value={selectUser.serie} />
          <CustomModal.Info label="Cargo" value={selectUser.office} />
          <CustomModal.Info label="CBO nº" value={selectUser.cbo} />
          <CustomModal.Info label="Escolaridade" value={selectUser.education} />
          <CustomModal.Info
            label="Estado Civil"
            value={selectUser.maritalStatus}
          />
          <CustomModal.Info
            label="Nacionalidade"
            value={selectUser.nationality}
          />
          <CustomModal.Info label="PIS" value={selectUser.pis} />
          <CustomModal.Info label="RG" value={selectUser.rg} />
          <CustomModal.Info label="CEP" value={selectUser.cep} />
          <CustomModal.Info label="Rua" value={selectUser.road} />
          <CustomModal.Info label="Número" value={selectUser.number} />
          <CustomModal.Info label="Complemento" value={selectUser.complement} />
          <CustomModal.Info label="Bairro" value={selectUser.neighborhood} />
          <CustomModal.Info label="Cidade" value={selectUser.city} />
          <CustomModal.Info label="UF" value={selectUser.state} />
          <CustomModal.Info label="Nível" value={selectUser.level} />
          <CustomModal.Info label="Departamento" value={selectUser.department} />
          <CustomModal.Info label="Empresa" value={selectUser.company} />
          <CustomModal.Info label="Centro de Custo" value={selectUser.costCenter} />
          <CustomModal.Info label="Data de Admição" value={formatDate(selectUser.dateAdmission)} />
          <CustomModal.Info label="Data de Demissão" value={formatDate(selectUser.dateResignation)} />
          <CustomModal.Info label="Salário Inicial" value={selectUser.initialWage} />
          <CustomModal.Info label="Salário Atual" value={selectUser.currentWage} />
        </Modal>
      )}
      {isModalVisibleUpdate && (
        <Modal
          title="Editar usuário"
          open={isModalVisibleUpdate}
          centered
          style={{ top: 20 }}
          onCancel={() => setIsModalVisibleUpdate(false)}
          width={1200}
          footer={[
            <Button
              key="submit"
              type="primary"
              onClick={() => confirmUpdate(selectUser)}
            >
              Atualizar
            </Button>,
            <Button key="back" onClick={() => setIsModalVisibleUpdate(false)}>
              Voltar
            </Button>,
          ]}
        >
          <Form.Fragment section="Dados do Colaborador">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Nome Completo"
                type="text"
                name="name"
                value={selectUser.name}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.DateInput
                label="Data de Nascimento"
                name="birthday"
                onChange={handleChange}
                value={selectUser.birthday}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="CPF"
                name="cpf"
                value={selectUser.cpf}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="CTPS"
                name="ctps"
                value={selectUser.ctps}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Série"
                type="text"
                name="serie"
                value={selectUser.serie}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Select
                label="Cargo"
                type="text"
                name="office"
                value={selectUser.office}
                onChange={handleChange}
                options={Options.Office()}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="CBO nº"
                name="cbo"
                value={selectUser.cbo}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Select
                label="Escolaridade"
                type="text"
                name="education"
                value={selectUser.education}
                onChange={handleChange}
                options={Options.Departments()}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Estado Civil"
                type="text"
                name="maritalStatus"
                value={selectUser.maritalStatus}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Nacionalidade"
                type="text"
                name="nationality"
                value={selectUser.nationality}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="PIS"
                type="text"
                name="pis"
                value={selectUser.pis}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="RG"
                type="text"
                name="rg"
                value={selectUser.rg}
                onChange={handleChange}
              />
            </CustomInput.Root>
          </Form.Fragment>
          <Form.Fragment section="Endereço do Colaborador">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="CEP"
                type="text"
                name="cep"
                value={selectUser.cep}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Rua"
                type="text"
                name="road"
                value={selectUser.road}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Número"
                type="text"
                name="number"
                value={selectUser.number}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Complemento"
                type="text"
                name="complement"
                value={selectUser.complement}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Bairro"
                type="text"
                name="neighborhood"
                value={selectUser.neighborhood}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Cidade"
                type="text"
                name="city"
                value={selectUser.city}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="UF"
                type="text"
                name="state"
                value={selectUser.state}
                onChange={handleChange}
              />
            </CustomInput.Root>
          </Form.Fragment>
          <Form.Fragment section="Dados da Função">
            <CustomInput.Root columnSize={6}>
              <CustomInput.Select
                label="Nível"
                type="text"
                name="level"
                value={selectUser.level}
                onChange={handleChange}
                options={Options.Companies()}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Select
                label="Departamento"
                name="department"
                value={selectUser.department}
                onChange={handleChange}
                options={Options.Departments()}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Select
                label="Empresa"
                name="company"
                value={selectUser.company}
                onChange={handleChange}
                options={Options.Companies()}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Select
                label="Centro de Custo"
                name="costCenter"
                value={selectUser.costCenter}
                onChange={handleChange}
                options={Options.Units()}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.DateInput
                label="Data de Admissão"
                name="dateAdmission"
                value={selectUser.dateAdmission}
                onChange={handleDateAdmission}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.DateInput
                label="Data de Demissão"
                name="dateResignation"
                value={selectUser.dateResignation}
                onChange={handleDateResignation}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Salário Inicial"
                type="text"
                name="initialWage"
                value={selectUser.initialWage}
                onChange={handleChange}
              />
            </CustomInput.Root>
            <CustomInput.Root columnSize={6}>
              <CustomInput.Input
                label="Salário Atual"
                type="text"
                name="currentWage"
                value={selectUser.currentWage}
                onChange={handleChange}
              />
            </CustomInput.Root>
          </Form.Fragment>
        </Modal>
      )}
    </Table.Root>
  );
}
