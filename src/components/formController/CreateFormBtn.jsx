"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { z } from "zod";
import EmployeeService from "../../services/EmployeeService";
import { MultiSelect } from "../custom/multi-select";
import { Toast } from "../toasts";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { createForm } from "./Form";

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "O nome deve ter pelo menos 4 caracteres." }),
  description: z.string().optional(),
  type: z.enum(["PPA", "PPO", "PPC", "Public"], {
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

function CreateFormBtn({ onFormCreated }) {
  const [users, setUsers] = useState([]);
  const service = new EmployeeService();
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values) {
    try {
      await createForm(values);
      Toast.Success("Formulário criado com sucesso!");
      await onFormCreated();
    } catch (error) {
      Toast.Error("Algo deu errado, tente novamente!");
    }
  }

  const dataUser = users.map((user) => ({
    value: user.id,
    label: user.name,
    id: user.id,
  }));

  useEffect(() => {
    const fetchUsers = async () => {
      const registeredInfoRequest = await service.getEmployeesInfo();
      const registeredInfo = registeredInfoRequest.data.listUsers;

      setUsers(registeredInfo);
    };
    fetchUsers();
  }, []);

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          vairant={"outline"}
          className="group border border-primary/20 h-[190px] items-center 
            justify-center flex flex-col hover:border-primary hover:cursor-pointer 
            border-dashed gap-4 bg-background w-full"
        >
          <BsFileEarmarkPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">
            Criar Novo Formulário
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Formulário</DialogTitle>
          <DialogDescription>
            Criar novo formulário para coletar dados
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PPA">PPA</SelectItem>
                      <SelectItem value="PPC">PPC</SelectItem>
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
                      defaultValue={field.value}
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

export default CreateFormBtn;
