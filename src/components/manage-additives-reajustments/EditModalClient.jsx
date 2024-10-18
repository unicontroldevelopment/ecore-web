import { Button, Modal } from "antd";
import React from "react";
import { Form } from "../form";
import { CustomInput } from "../input";

const EditClientModal = ({
  isVisible,
  onClose,
  onUpdate,
  contract,
  handleChangeUpdate,
  handleFormatsChangeUpdate,
  handleSignChange,
  signs,
}) => {
  const isContractReady =
    contract && contract.signOnContract && contract.signOnContract[0];

  return (
    <Modal
    title="Editar Cliente"
    open={isVisible}
    centered
    style={{ top: 20 }}
    onCancel={() => {
      onClose(false);
    }}
    width={1200}
    footer={[
      <Button
        key="submit"
        type="primary"
        onClick={() => onUpdate(contract)}
      >
        Atualizar
      </Button>,
      <Button
        key="back"
        onClick={() => {
          onClose(false);
        }}
      >
        Voltar
      </Button>,
    ]}
  >
      {isContractReady ? (
        <>
            <Form.Fragment section="Contratante">
              <CustomInput.Root columnSize={6}>
                <CustomInput.Input
                  label="Nome"
                  type="text"
                  name="name"
                  value={contract.name}
                  onChange={handleChangeUpdate}
                />
              </CustomInput.Root>
              <CustomInput.Root columnSize={6}>
                <CustomInput.Input
                  label="CPF ou CNPJ"
                  type="text"
                  name="cpfcnpj"
                  value={contract.cpfcnpj}
                  onChange={handleFormatsChangeUpdate}
                />
              </CustomInput.Root>
              <CustomInput.Root columnSize={6}>
                <CustomInput.Input
                  label="CEP"
                  type="text"
                  name="cep"
                  value={contract.cep}
                  onChange={handleFormatsChangeUpdate}
                />
              </CustomInput.Root>
              <CustomInput.Root columnSize={6}>
                <CustomInput.Input
                  label="Rua"
                  type="text"
                  name="road"
                  value={contract.road}
                  onChange={handleChangeUpdate}
                />
              </CustomInput.Root>
              <CustomInput.Root columnSize={3}>
                <CustomInput.Input
                  label="Número"
                  type="text"
                  name="number"
                  value={contract.number}
                  onChange={handleChangeUpdate}
                />
              </CustomInput.Root>
              <CustomInput.Root columnSize={3}>
                <CustomInput.Input
                  label="Complemento"
                  type="text"
                  name="complement"
                  value={contract.complement}
                  onChange={handleChangeUpdate}
                />
              </CustomInput.Root>
              <CustomInput.Root columnSize={6}>
                <CustomInput.Input
                  label="Bairro"
                  type="text"
                  name="neighborhood"
                  value={contract.neighborhood}
                  onChange={handleChangeUpdate}
                />
              </CustomInput.Root>
              <CustomInput.Root columnSize={6}>
                <CustomInput.Input
                  label="Cidade"
                  type="text"
                  name="city"
                  value={contract.city}
                  onChange={handleChangeUpdate}
                />
              </CustomInput.Root>
              <CustomInput.Root columnSize={6}>
                <CustomInput.Input
                  label="UF"
                  type="text"
                  name="state"
                  value={contract.state}
                  onChange={handleChangeUpdate}
                />
              </CustomInput.Root>
            </Form.Fragment>
            <Form.Fragment section="Franquia">
              <CustomInput.Select
                label="Assinaturas"
                name="signOnContract"
                value={
                  contract.signOnContract[0].Contract_Signature
                    .socialReason
                }
                options={signs.map((sign) => sign.socialReason)}
                onChange={handleSignChange}
                multiple={false}
              />
            </Form.Fragment>
        </>
      ) : (
        <p>Carregando dados do contrato...</p>
      )}
    </Modal>
  );
};

export default React.memo(EditClientModal);
