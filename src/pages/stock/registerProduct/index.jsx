import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Form } from "../../../components/form";
import { CustomInput } from "../../../components/input";
import { CustomSwitch } from "../../../components/switch";
import { Toast } from "../../../components/toasts";
import VerifyUserRole from "../../../hooks/VerifyUserRole";

export default function RegisterProduct() {
  VerifyUserRole(["Master", "Administrador", "Operacional"]);
  const navigate = useNavigate();

  const [product, setProduct] = React.useState({
    name: "",
    unitOfMeasurement: "",
    unit: "",
    purchaseQuantity: "",
    exitQuantity: "",
    quantityMinimum: "",
    numberNF: "",
    baseValue: "",
    barCode: "",
    agcView: false,
    test: "",
    unitEntrance: "",
    unitExit: "",
  });

  React.useEffect(() => {
    if (product.unit && product.unitOfMeasurement && product.purchaseQuantity) {
      let quantityForExit = 0;
      const quantity = parseFloat(product.purchaseQuantity);
      const unitEntranceValue = parseFloat(product.unit);
      const unitExitValue = parseFloat(product.unitOfMeasurement);

      if (product.unitEntrance === "kg" && product.unitExit === "g") {
        quantityForExit = (quantity * unitEntranceValue * 1000) / unitExitValue;
      } else if (product.unitEntrance === "kg" && product.unitExit === "mg") {
        quantityForExit =
          (quantity * unitEntranceValue * 1000000) / unitExitValue;
      } else if (product.unitEntrance === "g" && product.unitExit === "mg") {
        quantityForExit = (quantity * unitEntranceValue * 1000) / unitExitValue;
      } else if (product.unitEntrance === "l" && product.unitExit === "ml") {
        quantityForExit = (quantity * unitEntranceValue * 1000) / unitExitValue;
      } else if (
        (product.unitEntrance === "kg" && product.unitExit === "kg") ||
        (product.unitEntrance === "g" && product.unitExit === "g") ||
        (product.unitEntrance === "mg" && product.unitExit === "mg") ||
        (product.unitEntrance === "l" && product.unitExit === "l") ||
        (product.unitEntrance === "ml" && product.unitExit === "ml") ||
        (product.unitEntrance === "unidade" && product.unitExit === "unidade")
      ) {
        quantityForExit = (quantity * unitEntranceValue) / unitExitValue;
      } else {
        Toast.Info("Ajuste as medidas para serem coerentes!");
      }

      setProduct((prevState) => ({
        ...prevState,
        exitQuantity: quantityForExit,
      }));
    } else {
      setProduct((prevState) => ({
        ...prevState,
        exitQuantity: "",
      }));
    }
  }, [product.unit, product.unitOfMeasurement, product.purchaseQuantity]);
  const handleChange = (event) => {
    setProduct((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleUnitChange = (inputValue, unit) => {
    if (inputValue) {
      setProduct((prevState) => ({
        ...prevState,
        unit: inputValue,
        unitEntrance: unit,
      }));
    } else {
      setProduct((prevState) => ({
        ...prevState,
        unitEntrance: unit,
      }));
    }
  };

  const handleUnitExitChange = (inputValue, unit) => {
    if (inputValue) {
      setProduct((prevState) => ({
        ...prevState,
        unitOfMeasurement: inputValue,
        unitExit: unit,
      }));
    } else {
      setProduct((prevState) => ({
        ...prevState,
        unitExit: unit,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

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
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Nome do Produto"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.InputWithSelect
            label="Medida de Compra"
            type="text"
            name="unit"
            value={product.unit}
            onChange={(inputValue, unit) => handleUnitChange(inputValue, unit)}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.InputWithSelect
            label="Medida de Retirada"
            type="text"
            name="unitOfMeasurement"
            value={product.unitOfMeasurement}
            onChange={(inputValue, unit) =>
              handleUnitExitChange(inputValue, unit)
            }
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Quantidade"
            type="text"
            name="purchaseQuantity"
            value={product.purchaseQuantity}
            onChange={handleChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Quantidade para Retirada"
            type="number"
            name="exitQuantity"
            value={product.exitQuantity}
            disabled={true}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Quantidade Mínima"
            type="text"
            name="quantityMinimum"
            value={product.quantityMinimum}
            onChange={handleChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Número da Nota Fiscal"
            type="text"
            name="numberNF"
            value={product.numberNF}
            onChange={handleChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Valor Base"
            type="text"
            name="baseValue"
            value={product.baseValue}
            onChange={handleChange}
          />
        </CustomInput.Root>
        <CustomInput.Root columnSize={6}>
          <CustomInput.Input
            label="Código de Barras"
            type="text"
            name="barCode"
            value={product.barCode}
            onChange={handleChange}
          />
        </CustomInput.Root>

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
