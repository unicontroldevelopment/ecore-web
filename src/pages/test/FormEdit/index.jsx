import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/animations/Loading";
import { getFormById } from "../../../components/formController/Form";
import { Toast } from "../../../components/toasts";
import FormBuilder from "./FormBuilder";

function BuilderEditPage() {
  const { id } = useParams();
  const [form, setForm] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      const data = await getFormById(Number(id));
      setForm(data);
      setLoading(false);
    };

    fetchForms();
  }, []);

  if (loading) {
    return <Loading />;
  };

  if (!form) {
    Toast.Error("Formulário não encontrado!");
  };

  return <FormBuilder form={form} />;
};

export default BuilderEditPage;
