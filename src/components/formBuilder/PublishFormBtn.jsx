import { useTransition } from "react";
import { MdOutlinePublish } from "react-icons/md";
import FormService from "../../services/FormService";
import Loading from "../animations/Loading";
import { Toast } from "../toasts";
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
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

function PublishFormBtn({id}) {
  const [loading, startTransition] = useTransition();
  const service = new FormService();

  async function PublishForm() {
    try {

        await service.publishForm(id);
        Toast.Success("Formulário publicado com sucesso!")
        window.location.reload()
    } catch (error) {
        Toast.Error("Erro ao publicar formulário!")
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400">
          <MdOutlinePublish className="h-4 w-4" />
          Publicar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
        <AlertDialogHeader>
          <AlertDialogDescription>
          Ao publicar este formulário irá ficar disponivel ao publico e você
          poderá coletar dados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(PublishForm);
            }}
          >
            Publicar {loading && <Loading />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PublishFormBtn;
