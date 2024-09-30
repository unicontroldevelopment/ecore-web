import { useTransition } from "react";
import { HiSaveAs } from "react-icons/hi";
import FormService from "../../services/FormService";
import Loading from "../animations/Loading";
import { Toast } from "../toasts";
import { Button } from "../ui/button";
import useDesigner from "./hooks/useDesigner";

function SaveFormBtn({id}) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();
  const service = new FormService();

  const updateFormContent = async () => {
    try {
      await service.updateContent(id, elements);
      Toast.Success("Formulário salvo com sucesso")
    } catch (error) {
     Toast.Error("Erro ao salvar formulário!")
    }
  };
  return (
    <Button variant={"outline"} className="gap-2" disabled={loading} onClick={() => {startTransition(updateFormContent)}}>
      <HiSaveAs className="h-4 w-4" />
      Save
      {loading && <Loading/>}
    </Button>
  );
}

export default SaveFormBtn;
