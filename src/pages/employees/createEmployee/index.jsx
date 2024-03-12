import * as React from "react";
import { useNavigate } from "react-router-dom";
import VerifyUserRole from "../../../hooks/VerifyUserRole";

import { CustomInput } from "../../../components/input/index";

export default function CreateEmployee() {
  return (
    <>
      <CustomInput.Root columnSize={12}>
        <CustomInput.Input>Nome</CustomInput.Input>
      </CustomInput.Root>
    </>
  );
}
