import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
("use client");

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { z } from "zod";
import EmployeeService from "../../services/EmployeeService";
import Loading from "../animations/Loading";
import { MultiSelect } from "../custom/multi-select";
import { getFormById, updateProperties } from "../formController/Form";
import { Toast } from "../toasts";
import { Button } from "../ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "O nome deve ter pelo menos 4 caracteres." }),
  description: z.string().optional(),
  type: z.enum(["PPA", "PPO", "Public"], {
    message: "Selecione um tipo de formulário.",
  }),
  users: z.array(z.number()).optional(),
  emails: z
    .string()
    .optional()
    .transform((value) =>
      value ? value.split(",").map((email) => email.trim()) : []
    ),
});

function EditPropertiesBtn({ id }) {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const service = new EmployeeService();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "",
      users: [],
      emails: "",
    },
  });

  const { reset } = form;

  async function onSubmit(values) {
    try {
      await updateProperties(id, values);
      Toast.Success("Propriedades editadas com sucesso!");
    } catch (error) {
      Toast.Error("Algo deu errado, tente novamente!");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFormById(id);
        const registeredInfoRequest = await service.getEmployeesInfo();
        const registeredInfo = registeredInfoRequest.data.listUsers;

        setUsers(registeredInfo);
        setFormData(response);

        reset({
          name: response.name || "",
          description: response.description || "",
          type: response.type || "",
          users: response.users?.map((user) => user.userId) || [],
          emails: response.emails?.map((email) => email.email).join(",") || "",
        });
      } catch (error) {
        Toast.Error("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, reset]);

  if (loading) {
    return (
      <Loading />
    );
  }

  const dataUser = users.map((user) => ({
    value: user.id,
    label: user.name,
    id: user.id,
  }));

  const selectedUserIds = formData.users?.map((user) => user.userId);

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"} className="gap-2">
          <FaEdit className="h-6 w-6" />
          Propriedades
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Propriedades</DialogTitle>
          <DialogDescription>
            Quem poderá acessar o formulário,receber os e-mails e o tipo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea row={5} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Formulário:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={formData.type}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PPA">PPA</SelectItem>
                      <SelectItem value="PPO">PPO</SelectItem>
                      <SelectItem value="Public">Publico</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="users"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuários</FormLabel>
                  <FormControl>
                    <MultiSelect
                      {...field}
                      options={dataUser}
                      onValueChange={(selectedIds) =>
                        field.onChange(selectedIds)
                      }
                      defaultValue={selectedUserIds}
                      placeholder="Usuarios que poderão visualizar o formulário"
                      variant="inverted"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mails para notificação</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      defaultValue={
                        formData.emails[0]?.email
                          ? formData.emails[0]?.email
                          : "Sem e-mails"
                      }
                      placeholder="Digite os e-mails separados por vírgula"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className="w-full mt-4"
          >
            {!form.formState.isSubmitting && <span>Salvar</span>}
            {form.formState.isSubmitting && (
              <ImSpinner2 className="animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditPropertiesBtn;
