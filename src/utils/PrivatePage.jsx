/* eslint-disable react/prop-types */
import * as React from "react";
import { AuthContext } from "../contexts/Auth";
import { Navigate } from "react-router-dom";

const PrivatePage = ({ children }) => {
  const { authenticated } = React.useContext(AuthContext);

  if (!authenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivatePage;
