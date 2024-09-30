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

function EditFormBtn({ id }) {
  const [loading, startTransition] = useTransition();
  const service = new FormService();

  async function EditForm() {
    try {
      await service.publishForm(id);
      Toast.Success("Formulário editado com sucesso!");
      window.location.reload();
    } catch (error) {
      Toast.Error("Erro ao editar formulário!");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400">
          <MdOutlinePublish className="h-4 w-4" />
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
        <AlertDialogHeader>
          <AlertDialogDescription>
            Após editar os envios antigos continurão com o mesmo conteudo.
            <br /> <br />
            <span className="font-medium">
              Somente os novos envios terão o novo modelo.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(EditForm);
            }}
          >
            Editar {loading && <Loading />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditFormBtn;
