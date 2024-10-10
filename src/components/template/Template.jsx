/* eslint-disable react/prop-types */
import {
  ArrowLeftOutlined,
  EditOutlined,
  HeartFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PoweroffOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  Layout,
  Menu,
  Modal,
  Space,
} from "antd";
import { useContext, useState } from "react";
import { AiFillDashboard } from "react-icons/ai";
import {
  FaBoxes,
  FaFileAlt,
  FaFileExport,
  FaUserLock,
  FaUsersCog,
} from "react-icons/fa";
import { MdOutgoingMail, MdStarRate } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/Auth";
import { UserTypeContext } from "../../contexts/UserTypeContext";
import EmployeeService from "../../services/EmployeeService";
import { Toast } from "../toasts";
import "./style.css";

const { Header, Sider, Content, Footer } = Layout;

const { SubMenu } = Menu;

const Template = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState(false);
  const backToLastPage = useNavigate(-1);
  const { logoutAuth } = useContext(AuthContext);
  const { userType, userData } = useContext(UserTypeContext);
  const service = new EmployeeService();

  const hasAccess = (roles) => {
    if (!Array.isArray(userType) || !userType.length) return false;

    const userRoles = userType.map((role) => {
      if (typeof role === "object" && role.role) {
        return role.role.name;
      }
      return role;
    });

    return roles.some((role) => userRoles.includes(role));
  };

  const showChangePasswordModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handlePasswordChange = async () => {
    form
      .validateFields()
      .then(async (values) => {
        
        const response = await service.changePassword(userData.id, values)
        if(response.status === 200) {
          Toast.Success("Senha alterada com sucesso!");
        }
        setIsModalVisible(false);
      })
      .catch((error) => {
        console.log("Erro ao validar o formulário:", error);
      });
  };

  const handleMenuClick = (e) => {
    const selectedItem = items.find((item) => item.key === e.key);
    if (selectedItem && selectedItem.onClick) {
      selectedItem.onClick();
    }
  };

  const items = [
    {
      key: "1",
      label: "Alterar senha",
      onClick: () => {
        showChangePasswordModal();
      },
      icon: <EditOutlined />,
    },
    {
      key: "2",
      label: "Logout",
      onClick: () => {
        logoutAuth();
      },
      icon: <PoweroffOutlined />,
    },
  ];

  const menuItems = [
    {
      key: "1",
      icon: <AiFillDashboard />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <MdOutgoingMail />,
      label: "E-mails",
      items: [
        {
          key: "2-1",
          label: <Link to="/emails/create">Cadastrar E-mail</Link>,
        },
        {
          key: "2-2",
          label: <Link to="/emails/list">Lista de Emails</Link>,
        },
      ],
    },
    {
      key: "3",
      icon: <FaUserLock />,
      label: "Acessos Servidor",
      items: [
        {
          key: "3-1",
          label: <Link to="/serveraccess/create">Cadastrar</Link>,
        },
        {
          key: "3-2",
          label: <Link to="/serveraccess/list">Listar</Link>,
        },
      ],
    },
    {
      key: "4",
      icon: <FaUsersCog />,
      label: "Funcionários",
      items: [
        {
          key: "4-1",
          label: <Link to="/employee/create">Cadastrar Funcionários</Link>,
        },
        {
          key: "4-2",
          label: <Link to="/employee/list">Listar Funcionários</Link>,
        },
        {
          key: "4-3",
          label: <Link to="/employee/createInfo">Cadastrar Informações</Link>,
        },
        {
          key: "4-4",
          label: <Link to="/employee/manageInfo">Controle de Informações</Link>,
        },
        {
          key: "4-5",
          label: <Link to="/employee/workingHours">Horas Trabalhadas</Link>,
        },
      ],
    },
    {
      key: "5",
      icon: <FaFileExport />,
      label: "Documentos",
      items: [
        {
          key: "5-1",
          label: (
            <Link to="/documents/createService">Controle de Serviços</Link>
          ),
        },
        {
          key: "5-2",
          label: <Link to="/documents/createDocument">Gerar Documentos</Link>,
        },
        {
          key: "5-3",
          label: <Link to="/documents/generateContract">Gerar Contratos</Link>,
        },
        {
          key: "5-4",
          label: (
            <Link to="/documents/manageContracts">Gerenciar Contratos</Link>
          ),
        },
        {
          key: "5-5",
          label: <Link to="/documents/customers">Aditivos/Reajustes</Link>,
        },
      ],
    },
    {
      key: "6",
      icon: <MdStarRate />,
      label: "Avaliação",
      items: [
        {
          key: "6-1",
          label: <Link to="/PPA-PPO/PPA">PPA</Link>,
        },
        {
          key: "6-2",
          label: <Link to="/PPA-PPO/PPO">PPO</Link>,
        },
      ],
    },
    {
      key: "7",
      icon: <FaBoxes />,
      label: "Estoque",
      items: [
        {
          key: "7-1",
          label: <Link to="/stock/registerProduct">Cadastrar Produto</Link>,
        },
        {
          key: "7-2",
          label: <Link to="/stock/registerEPI">Cadastrar Uniforme/EPI</Link>,
        },
        {
          key: "7-3",
          label: <Link to="/stock/control">Controle de Estoque</Link>,
        },
        {
          key: "7-4",
          label: <Link to="/stock/movements">Estoque Colaborador</Link>,
        },
        {
          key: "7-5",
          label: <Link to="/dashboard">Código de Barras</Link>,
        },
        {
          key: "7-6",
          label: <Link to="/stock/movements">Movimentações</Link>,
        },
      ],
    },
    {
      key: "8",
      icon: <FaFileAlt />,
      label: "Formulários",
      items: [
        {
          key: "8-1",
          label: <Link to="/forms">Gerenciar Formulários</Link>,
        },
      ],
    },
  ];

  const userMenu = (
    <Card
      style={{
        width: 250,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div
        style={{
          background: "#4f76be",
          padding: "16px 20px",
          color: "white",
        }}
      >
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>
          Olá, <strong>{userData.name ? userData.name : "Usuário"}</strong>
        </h3>
      </div>
      <Menu
        onClick={handleMenuClick}
        selectable={false}
        style={{ border: "none" }}
      >
        {items.map((item) => (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            style={{
              padding: "12px 20px",
              fontSize: 14,
            }}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    </Card>
  );

  return (
    <Layout
      style={{
        minHeight: "100vh",
        maxHeight: "100vh",
        minWidth: "100vw",
        maxWidth: "100vw",
      }}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={230}
        style={{
          backgroundColor: "#4168b0",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {collapsed ? (
          <Space className="trigger">
            <MenuUnfoldOutlined
              className="trigger"
              onClick={() => setCollapsed(!collapsed)}
              style={{
                color: "#fff",
                marginBottom: 0,
                padingBottom: 0,
                marginLeft: 5,
              }}
            />
          </Space>
        ) : (
          <Space className="trigger">
            <MenuFoldOutlined
              className="trigger"
              onClick={() => setCollapsed(!collapsed)}
              style={{
                color: "#fff",
                marginBottom: 0,
                padingBottom: 0,
                marginLeft: 5,
              }}
            />
          </Space>
        )}
        <div className="logo">{collapsed ? null : null}</div>
        <Menu
          theme="dark"
          mode="inline"
          style={{
            backgroundColor: "#4168b0",
            color: "#fff",
          }}
        >
          {menuItems.map((item) => {
            if (item.items) {
              return (
                <SubMenu
                  key={item.key}
                  icon={item.icon}
                  title={item.label}
                  className="custom-submenu"
                >
                  {item.items.map((subItem) => (
                    <Menu.Item key={subItem.key}>{subItem.label}</Menu.Item>
                  ))}
                </SubMenu>
              );
            }
            return (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                className="custom-submenu"
              >
                {item.label}
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: "#4f76be",
          }}
        >
          <Space className="trigger">
            <ArrowLeftOutlined
              className="trigger"
              style={{ color: "#fff", float: "left" }}
              onClick={() => backToLastPage(-1)}
            />
          </Space>
          <Dropdown  overlay={userMenu} trigger={["click"]}>
            <Space className="trigger" style={{ float: "right" }}>
              <UserOutlined style={{ color: "#fff" }} />
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: "1%",
            padding: "1%",
            minHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {props.children}
        </Content>
        <Footer
          style={{
            alignSelf: "center",
            justifySelf: "center",
            maxHeight: 30,
            marginTop: 10,
            padding: 5,
            textAlign: "center",
            width: "100%",
            backgroundColor: "#fff",
          }}
        >
          Made with <HeartFilled /> by NewSis
        </Footer>
      </Layout>
      <Modal
        title="Alterar Senha"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handlePasswordChange}>
            Alterar Senha
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Senha Atual"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Por favor, insira sua senha atual!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Nova Senha"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Por favor, insira sua nova senha!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirmar Nova Senha"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Por favor, confirme sua nova senha!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("As senhas não coincidem!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Template;
