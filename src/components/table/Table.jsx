/* eslint-disable react/prop-types */
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Table } from "antd";
import { FaRegEdit, FaRegEye, FaRegTrashAlt } from "react-icons/fa";

export const CustomTable = ({ data, onView, onUpdate, confirm, cancel }) => {
  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Perfil",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Setor",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Empresa",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Unidade",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Ações",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button style={{backgroundColor: "#FFFF00"}} onClick={() => onView(record)}>
            <FaRegEye />
          </Button>
          <Button style={{backgroundColor: "#4D4DFF"}} onClick={() => onUpdate(record)}>
            <FaRegEdit />
          </Button>
          <Popconfirm
            title="Deletar usuário!"
            description="Você tem certeza que quer deletar este usuário?"
            onConfirm={() => confirm(record)}
            onCancel={() => cancel(record)}
            okText="Sim"
            cancelText="Não"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button style={{backgroundColor: "#FF0000"}}>
              <FaRegTrashAlt />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const paginationConfig = {
    defaultPageSize: 15,
  };

  return (
    <Table columns={columns} dataSource={data} pagination={paginationConfig} rowKey="id" />
  );
};
