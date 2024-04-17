import * as React from "react";
import VerifyUserRole from "../../hooks/VerifyUserRole";
import MyViewer from "../../utils/pdf/contracts/teste";

export default function Lab() {
  VerifyUserRole(["Master", "Administrador", "RH"]);

  const [PDF, setPDF] = React.useState([]);

  const handleUpload = () => {

  }

  return (
        <MyViewer />
  );
}
