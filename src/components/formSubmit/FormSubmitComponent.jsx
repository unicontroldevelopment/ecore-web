"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { HiCursorClick } from "react-icons/hi";
import FormService from "../../services/FormService";
import Loading from "../animations/Loading";
import FormElements from "../formBuilder/FormElements";
import { Toast } from "../toasts";
import { Button } from "../ui/button";

function FormSubmitComponent({ formUrl, content }) {
  const formValues = useRef({});
  const formErrors = useRef({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());
  const service = new FormService();

  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [nameError, setNameError] = useState("");

  const validate = (formElement, currentValue) => {
    const element = formElement;
    if (element.extraAtribbutes?.required) {
      return currentValue.length > 0;
    }

    return true;
  };

  const validateForm = useCallback(() => {
    let isValid = true;

    content.forEach((field) => {
      const actualValue = formValues.current[field.id] || "";
      const valid = validate(field, actualValue);

      if (!valid) {
        formErrors.current[field.id] = true;
        isValid = false;
      }
    });

    return isValid;
  }, [content]);

  const submitValue = useCallback((key, value) => {
    formValues.current[key] = value;
  }, []);

  const openConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmit = async () => {
    setNameError("");
    if (!senderName.trim()) {
      setNameError("O nome é obrigatório.");
      Toast.Error("Preencha os campos obrigatórios!");
      return;
    }

    setShowConfirmationModal(false);
    formErrors.current = {};
    const validForm = validateForm();

    if (!validForm) {
      setRenderKey(new Date().getTime());
      Toast.Error("Preencha os campos obrigatórios!");
      return;
    }

    try {
      await service.submitForm(formUrl, formValues.current, senderName);
      setSubmitted(true);
    } catch (error) {
      Toast.Error("Ocorreu um erro ao tentar enviar o formulário");
    }
  };

  if (submitted) {
    return (
      <div className="flex justify-center w-full h-full items-center p-8">
        <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-gray-500 rounded">
          <h1 className="text-2xl font-bold">Formulário enviado</h1>
          <p className="text-muted-foreground">
            Obrigado por enviar este formulário, você pode fechar a página
            agora.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full h-full items-center p-8 bg-slate-400">
      <div
        key={renderKey}
        className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-gray-500 rounded"
      >
        {content.map((element) => {
          const FormElement = FormElements[element.type].formComponent;
          return (
            <FormElement
              key={element.id}
              elementInstance={element}
              submitValue={submitValue}
              isInvalid={formErrors.current[element.id]}
              defaultValue={formValues.current[element.id]}
            />
          );
        })}
        <Button
          className="mt-8"
          onClick={openConfirmationModal}
          disabled={pending}
        >
          {!pending && (
            <div>
              <HiCursorClick className="mr-2" />
              Enviar
            </div>
          )}
          {pending && <Loading />}
        </Button>
      </div>

      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirmação de Envio</h2>
            <p className="mb-4">Por favor, insira seu nome antes de enviar o formulário:</p>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className={`border p-2 w-full mb-4 ${nameError ? 'border-red-500' : ''}`}
              placeholder="Seu nome"
            />
            {nameError && (
              <p className="text-red-500 text-sm mb-4">{nameError}</p>
            )}
            <div className="flex gap-4">
              <Button
                onClick={() => setShowConfirmationModal(false)}
                className="bg-gray-300"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {startTransition(handleConfirmSubmit)}}
              >
                Confirmar Envio
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormSubmitComponent;
