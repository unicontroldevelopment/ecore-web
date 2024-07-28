import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input";
import { CustomSwitch } from "../../../components/switch";
import VerifyUserRole from "../../../hooks/VerifyUserRole";
import { Options } from "../../../utils/options";

export default function RegisterProduct() {
  VerifyUserRole(["Master", "Administrador", "RH"]);
  const navigate = useNavigate();

  const [product, setProduct] = React.useState({
    name: "",
    type: "Entrada",
    unitOfMeasurement: "",
    unit: "",
    quantity: "",
    quantityMinimum: "",
    numberNF: "",
    baseValue: "",
    barCode: "",
    agcView: false,
  });

  const handleChange = (event) => {
    setProduct((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  }

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <Form.Root
      title="Cadastrar Produto"
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
    >
      <Form.Fragment section="Dados do Produto">
          <CustomInput.Input
            label="Nome do Produto"
            name="name"
            value={product.name}
            onChange={handleChange}
          />

          <CustomInput.Input
            label="Unidade de Medida"
            type="text"
            name="unitOfMeasurement"
            value={product.unitOfMeasurement}
            onChange={handleChange}
          />
          <CustomInput.Select
            label="Unidade"
            type="text"
            name="unit"
            value={product.unit}
            onChange={handleChange}
            options={Options.Units()}
          />
          <CustomInput.Input
            label="Quantidade"
            type="text"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
          />
          <CustomInput.Input
            label="Quantidade Mínima"
            type="text"
            name="quantityMinimum"
            value={product.quantityMinimum}
            onChange={handleChange}
          />
          <CustomInput.Input
            label="Número da Nota Fiscal"
            type="text"
            name="numberNF"
            value={product.numberNF}
            onChange={handleChange}
          />
          <CustomInput.Input
            label="Valor Base"
            type="text"
            name="baseValue"
            value={product.baseValue}
            onChange={handleChange}
          />
          <CustomInput.Input
            label="Código de Barras"
            type="text"
            name="barCode"
            value={product.barCode}
            onChange={handleChange}
          />
        <CustomSwitch.Root columnSize={24}>
          <CustomSwitch.Switch
            label="Este produto deve aparecer no AGC?"
            enabled={product.agcView}
            permissionName="agcView"
            onChange={(checked) => {
              setProduct({ ...product, agcView: checked });
            }}
          />
        </CustomSwitch.Root>
      </Form.Fragment>
    </Form.Root>
  );
}
