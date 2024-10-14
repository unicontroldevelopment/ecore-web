import { z } from "zod";
import FormService from "../../services/FormService";
import { Toast } from "../toasts";

const formSchema = z.object({
  name: z.string().min(4),
  description: z.string().optional(),
});

const service = new FormService();

export async function createForm(data) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    Toast.Error("Formulário invalido!");
    throw new Error("Formulário invalido!");
  }

  const { name, description, type, users, emails } = data;
  const form = await service.create({
    data: {
      name: name,
      description: description,
      type: type,
      users: users,
      emails: emails
    },
  });

  if (!form) {
    Toast.Error("Algo deu errado!");
  }

  return form.data.form.id;
}

export async function getForms(formId = "", type) {
  
    const form = await service.getForms( formId, type );

    return form.data.listForms;
}

export async function getFormById(id) {
    const form = await service.getById(id);

    return form.data.form;
}

export async function getFormByUrl(url) {
    const form = await service.getByUrl(url);

    return form.data.form;
}

export async function getSubmissions(id) {
    const form = await service.getSubmissions(id);

    return form.data.form;
}

export async function updateProperties(id, data) {
  const form = await service.update(id, data);

  return form.data.form;
}


