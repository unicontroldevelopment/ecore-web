import * as React from "react";
import { UserTypeContext } from "../../contexts/UserTypeContext";
import Template from "../../components/template/Template";

const Dashboard = () => {
  const { userType } = React.useContext(UserTypeContext);

  return (
    <Template>
      <h1>Dashboard - {userType}</h1>
    </Template>
  );
};

export default Dashboard;
