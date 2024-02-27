import * as React from "react";
import { UserTypeContext } from "../../contexts/UserTypeContext";

const Dashboard = () => {
  const { userType } = React.useContext(UserTypeContext);

  return <h1>Dashboard - {userType}</h1>;
};

export default Dashboard;
