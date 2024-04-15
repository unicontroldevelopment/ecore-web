/* eslint-disable react/prop-types */
import {
  ArrowLeftOutlined,
  HeartFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PoweroffOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, Layout, Menu, Space } from "antd";
import { useContext, useState } from "react";
import { AiFillDashboard } from "react-icons/ai";
import { FaBoxes, FaFileExport, FaUserLock, FaUsersCog } from "react-icons/fa";
import { MdOutgoingMail, MdStarRate } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/Auth";
import "./style.css";

const { Header, Sider, Content, Footer } = Layout;

const { SubMenu } = Menu;

const Template = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const backToLastPage = useNavigate(-1);
  const { logoutAuth } = useContext(AuthContext);

  const items = [
    {
      key: "1",
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
      children: [
        {
          key: "2-1",
          label: <Link to="/emails/create">Cadastrar E-mail</Link>,
        },
        {
          key: "2-2",
          label: <Link to="/emails/listGroup">Grupo</Link>,
        },
        {
          key: "2-3",
          label: <Link to="/dashboard">Franqueados</Link>,
        },
        {
          key: "2-4",
          label: <Link to="/dashboard">Newsis</Link>,
        },
        {
          key: "2-5",
          label: <Link to="/dashboard">Labs</Link>,
        },
      ],
    },
    {
      key: "3",
      icon: <FaUserLock />,
      label: "Acessos Servidor",
      children: [
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
      children: [
        {
          key: "4-1",
          label: <Link to="/employee/create">Cadastrar</Link>,
        },
        {
          key: "4-2",
          label: <Link to="/employee/list">Listar</Link>,
        },
        {
          key: "4-3",
          label: <Link to="/employee/manageInfo">Gerenciar Informações</Link>,
        },
        {
          key: "4-4",
          label: <Link to="/employee/createInfo">Cadastrar Informações</Link>,
        },
        {
          key: "4-5",
          label: <Link to="/dashboard">Horas Trabalhadas</Link>,
        },
      ],
    },
    {
      key: "5",
      icon: <FaFileExport />,
      label: "Documentos",
      children: [
        {
          key: "5-1",
          label: <Link to="/documents/create">Cadastrar Serviço</Link>,
        },
        {
          key: "5-2",
          label: <Link to="/dashboard">Gerar Documentos</Link>,
        },
        {
          key: "5-3",
          label: <Link to="/documents/generateContract">Gerar Contratos</Link>,
        },
        {
          key: "5-4",
          label: <Link to="/documents/manageContracts">Gerenciar Contratos</Link>,
        },
      ],
    },
    {
      key: "6",
      icon: <MdStarRate />,
      label: "Avaliação",
      children: [
        {
          key: "6-1",
          label: <Link to="/dashboard">PPA</Link>,
        },
        {
          key: "6-2",
          label: <Link to="/dashboard">PPO</Link>,
        },
      ],
    },
    {
      key: "7",
      icon: <FaBoxes />,
      label: "Estoque",
      children: [
        {
          key: "7-1",
          label: <Link to="/dashboard">Cadastrar Produto</Link>,
        },
        {
          key: "7-2",
          label: <Link to="/dashboard">Cadastrar Uniforme/EPI</Link>,
        },
        {
          key: "7-3",
          label: <Link to="/dashboard">Controle de Estoque</Link>,
        },
        {
          key: "7-4",
          label: <Link to="/dashboard">Código de Barras</Link>,
        },
        {
          key: "7-5",
          label: <Link to="/dashboard">Movimentações</Link>,
        },
      ],
    },
  ];

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
            if (item.children) {
              return (
                <SubMenu
                  key={item.key}
                  icon={item.icon}
                  title={item.label}
                  className="custom-submenu"
                >
                  {item.children.map((subItem) => (
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
          <Dropdown
            trigger={["click"]}
            menu={{ items }}
            autoAdjustOverflow={true}
          >
            <Space className="trigger" style={{ float: "right" }}>
              <UserOutlined
                style={{
                  color: "#fff",
                }}
              />
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: 10,
            padding: 15,
            minHeight: 650,
            marginBottom: 0,
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
    </Layout>
  );
};

export default Template;
