import { Button, Modal } from 'antd';
import React from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { MdPersonRemoveAlt1 } from 'react-icons/md';
import { TiArrowForward } from 'react-icons/ti';

const D4SignInfoModal = ({
  isVisible,
  onClose,
  signatures,
  resendSignature,
  cancelSignature,
}) => {
  return (
    <Modal
      title="Informações do Documento"
      open={isVisible}
      centered
      width="45%"
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Voltar
        </Button>,
      ]}
    >
      <h1>E-mails cadastrados</h1>
      {signatures.map((signatarios, index) =>
        signatarios.list !== null ? (
          signatarios.list.map((signatario, sigIndex) => {
            const verificaCor = () => {
              if (signatario.signed === "0") {
                return "#c72424";
              } else if (signatario.signed === "1") {
                return "#1eb300";
              }
            };

            return (
              <div
                key={`${index}-${sigIndex}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: verificaCor() }}>{signatario.email}</span>
                {signatario.signed === "0" ? (
                  <div>
                    <TiArrowForward
                      style={{ marginLeft: "10px" }}
                      cursor="pointer"
                      size={20}
                      color="#05628F"
                      onClick={() => resendSignature(signatarios.uuidDoc, signatario.email)}
                    />
                    <MdPersonRemoveAlt1
                      style={{ marginLeft: "10px" }}
                      cursor="pointer"
                      size={20}
                      color="#c72424"
                      onClick={() => cancelSignature(signatarios.uuidDoc, signatario.key_signer, signatario.email)}
                    />
                  </div>
                ) : (
                  <AiOutlineCheck
                    style={{ marginLeft: "10px" }}
                    size={20}
                    color="#1eb300"
                  />
                )}
              </div>
            );
          })
        ) : null
      )}
    </Modal>
  );
};

export default React.memo(D4SignInfoModal);