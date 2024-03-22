/* eslint-disable react/prop-types */
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Table } from "antd";
import { ActionsContainer } from "./styles";

export const CustomTable = ({
  data,
  onView,
  onUpdate,
  confirm,
  cancel,
  columns,
}) => {
  const columnsAndActions = [
    ...columns.map((column) => ({
      title: column.title,
      dataIndex: column.dataIndex,
      key: column.key,
      render: column.render,
    })),
    {
      title: "Ações",
      key: "actions",
      render: (text, record) => (
        <ActionsContainer>
          <Button
            style={{ backgroundColor: "#3f8ece", color: "#fff" }}
            onClick={() => onView(record)}
            icon={<EyeOutlined />}
            shape="circle"
          />
          <Button
            style={{ backgroundColor: "#36db6a", color: "#fff" }}
            onClick={() => onUpdate(record)}
            icon={<EditOutlined />}
            shape="circle"
          />
          <Popconfirm
            title="Tem certeza?"
            description="Você quer deletar esta informação?"
            onConfirm={() => confirm(record)}
            onCancel={() => cancel(record)}
            okText="Sim"
            cancelText="Não"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              style={{ backgroundColor: "#da4444", color: "#fff" }}
              icon={<DeleteOutlined />}
              shape="circle"
            />
          </Popconfirm>
        </ActionsContainer>
      ),
    },
  ];

  const paginationConfig = {
    defaultPageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '15', '20', '30', '50'],
  };

  return (
    <Table
      columns={columnsAndActions}
      dataSource={data}
      pagination={paginationConfig}
      rowKey="id"
    />
  );
};
