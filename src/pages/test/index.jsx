import { formatDistance } from "date-fns";
import { pt } from "date-fns/locale";
import React, { Suspense, useCallback, useContext, useEffect, useState } from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { FaEdit, FaTrashAlt, FaWpforms } from "react-icons/fa";
import { LuView } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import Loading from "../../components/animations/Loading";
import CreateFormBtn from "../../components/formController/CreateFormBtn";
import { getForms } from "../../components/formController/Form";
import { Toast } from "../../components/toasts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Skeleton } from "../../components/ui/skeleton";
import { UserTypeContext } from "../../contexts/UserTypeContext";
import { useDeleteForm } from "../../hooks/useDeleteForm";

const MASTER_ROLE = "Master";
function Teste() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId, userType } = useContext(UserTypeContext);

  const fetchForms = useCallback(async () => {
    setLoading(true);
    try {
      if (!Array.isArray(userType) || !userType.length) return;

      const userRoles = userType.map((role) => 
        typeof role === "object" && role.role ? role.role.name : role
      );

      const hasRole = userRoles.includes(MASTER_ROLE);

      const data = await getForms(hasRole ? null : userId, "Public");

      setForms(data);
    } catch (error) {
      console.error(error);
      Toast.Error("Erro ao carregar formulários");
    } finally {
      setLoading(false);
    }
  }, [userId, userType]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container pt-4">
      <Separator className="my-6" />
      <h2 className="text-4xl font-bold col-span-2">Seus Formulários</h2>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormBtn onFormCreated={fetchForms} />
        <Suspense fallback={<FormCardsSkeleton />}>
          {forms.map((form) => (
            <FormCard key={form.id} form={form} onDelete={fetchForms} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}

function FormCardsSkeleton() {
  return (
    <>
      {[1, 2, 3, 4].map((el) => (
        <Skeleton
          key={el}
          className="border-2 border-primary-/20 h-[190px] w-full"
        />
      ))}
    </>
  );
}

const FormCard = React.memo(function FormCard({ form, onDelete }) {
  const navigate = useNavigate();
  const { deleteForm, loading } = useDeleteForm(form.id, onDelete);

  if (!form || !form.name) {
    return <div>Sem informações do formulário</div>;
  }

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex items-center justify-between">
          <span className="truncate font-bold">{form.name}</span>
          <div className="flex items-center mr-3">
            <Badge variant={form.published ? "default" : "destructive"}>
              {form.published ? "Publicado" : "Rascunho"}
            </Badge>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="absolute top-2 right-2 p-1 rounded-full bg-accent">
                  <FaTrashAlt className="text-red-600" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser desfeita.
                    <br /> <br />
                    <span className="font-medium">
                      Ao excluir este formulário você não poderá recuperar os
                      dados perdidos!!
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={loading}
                    onClick={(e) => {
                      e.preventDefault();
                      deleteForm();
                    }}
                  >
                    Excluir {loading && <Loading />}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), {
            locale: pt,
            addSuffix: true,
          })}
          {form.published && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span>{form.visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description || "Sem descrição"}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full mt-2 text-md gap-4"
          variant={form.published ? "default" : "secondary"}
          onClick={() =>
            navigate(
              form.published ? `/form/${form.id}` : `/builder/${form.id}`
            )
          }
        >
          {form.published ? "Detalhes do Formulário" : "Editar Formulário"}
          {form.published ? <BiRightArrowAlt /> : <FaEdit />}
        </Button>
      </CardFooter>
    </Card>
  );
});

export default Teste;

