import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/animations/Loading";
import { getFormByUrl } from "../../../components/formController/Form";
import FormSubmitComponent from "../../../components/formSubmit/FormSubmitComponent";

function FormSubmit() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState();

  useEffect(() => {
    const fetchForms = async () => {
      const data = await getFormByUrl(id);

      setForm(data);
      setLoading(false);
    };

    fetchForms();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const formContent = form && form.content ? JSON.parse(form.content || "[]") : [];

  return <FormSubmitComponent formUrl={id} content={formContent} type={form.type}/>;
}

export default FormSubmit;
