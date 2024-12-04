import { Button, Upload } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import { Formats } from "../../utils/formats";
import { CustomInput } from "../input";

dayjs.extend(customParseFormat);
const formatMoney = (value) => {
  if (value === undefined || value === null) return "";
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const DraftForm = ({ draft, onSubmit, contractId }) => {
  const [file, setFile] = useState(null);
  const [values, setValues] = useState({
    title: "",
    value: "",
    date: dayjs(),
    contractId: contractId,
  });

  useEffect(() => {
    if (draft) {
      setValues({
        title: draft.title || "",
        value: Formats.Money(draft.value) || "",
        date: draft.date ? dayjs(draft.date, "DD/MM/YYYY") : dayjs(),
        contractId: contractId,
      });
    } else {
      setValues({
        title: "",
        value: "",
        date: dayjs(),
        contractId: contractId,
      });
    }
    setFile(null);
  }, [draft, contractId]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("value", values.value);
    formData.append(
      "date",
      values.date ? values.date.format("YYYY-MM-DD") : ""
    );
    formData.append("contractId", contractId);
    if (file) {
      formData.append("file", file);
    }

    await onSubmit(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const fileEvent = e.target.files[0];
    if (fileEvent) {
      setFile(fileEvent);
    }
  };

  const handleValueChange = (e) => {
    const value = e.target.value;
    setValues((prevValues) => ({
      ...prevValues,
      value: Formats.Money(value),
    }));
  };

  const handleDateChange = (date) => {
    setValues((prevState) => ({
      ...prevState,
      date: date ? dayjs(date) : null,
    }));
  };

  return (
    <>
      <CustomInput.Input
        label="Título"
        type="text"
        name="title"
        value={values.title}
        onChange={handleInputChange}
      />
      <CustomInput.Input
        label="Valor"
        name="value"
        onChange={handleValueChange}
        value={values.value}
        type="text"
      />
      <CustomInput.DateInput
        label="Data"
        name="date"
        value={values.date}
        onChange={handleDateChange}
      />
      <Upload
        beforeUpload={(file) => {
          handleFileChange({ target: { files: [file] } });
          return false;
        }}
        accept=".pdf"
        maxCount={1}
        showUploadList={false}
      >
        <Button
          title="Anexar Minuta"
          style={{ backgroundColor: "#ed9121", color: "#fff" }}
          shape="default"
        >
          Anexar Minuta
        </Button>
      </Upload>
      <Button type="primary" onClick={handleSubmit} className="ml-44">
        {draft ? "Atualizar" : "Criar"} Minuta
      </Button>
    </>
  );
};

export default DraftForm;

