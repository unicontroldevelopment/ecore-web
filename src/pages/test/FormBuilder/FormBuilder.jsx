import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/animations/Loading";
import Designer from "../../../components/formBuilder/Designer";
import DragOverlayWrapper from "../../../components/formBuilder/DragOverlayWarpper";
import EditPropertiesBtn from "../../../components/formBuilder/EditPropertiesBtn";
import PreviewDialogBtn from "../../../components/formBuilder/PreviewDialogBtn";
import PublishFormBtn from "../../../components/formBuilder/PublishFormBtn";
import SaveFormBtn from "../../../components/formBuilder/SaveFormBtn";
import useDesigner from "../../../components/formBuilder/hooks/useDesigner";
import { Toast } from "../../../components/toasts";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

function FormBuilder({ form }) {
  const { setElements, setSelectedElement } = useDesigner();
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    if(isReady) return;
    if(form.content){

      const elements = JSON.parse(form.content);
      setSelectedElement(null);
      setElements(elements);
    }

    const readyTimeout = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(readyTimeout)
  }, [form, setElements, setSelectedElement]);

  if(!isReady) {
    return <Loading />
  }

  const shareUrl = `${window.location.origin}/submit/${form.shareUrl}`

  if(form.published){
    return (
        <>
        <ReactConfetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={1000}/>
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="max-w-md shadow-2xl shadow-gray-800 border rounded-xl p-8">
                <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">Formulário Publicado</h1>
                <h2 className="text-2xl">Compartilhe este formulário</h2>
                <h3 className="text-xl text-muted-foreground border-b pb-10">Qualquer um com o link pode visualizar e enviar</h3>
                <div className="my-4 flex-col gap-2 items-center w-full border-b pb-4">
                    <Input className="w-full" readOnly value={shareUrl}/>
                    <Button className="mt-2 w-full" onClick={() => {
                        navigator.clipboard.writeText(shareUrl)
                        Toast.Success("Link Copiado")
                    }}>
                        Copiar Link
                    </Button>
                </div>
                <div className="flex items-center justify-center">
                    <Button variant={"link"} onClick={() => navigate("/forms")} className="gap-2">
                        <BsArrowLeft/>
                        Voltar para os Formulários
                    </Button>
                    <Button variant={"link"} onClick={() => navigate(`/form/${form.id}`)} className="gap-2">
                        Detalhes do Formulário
                        <BsArrowRight/>
                    </Button>
                </div>
            </div>
        </div>
        </>
    )
  }

  return (
    <DndContext sensors={sensors}>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "2px solid #ccc",
            padding: "16px",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: "500",
            }}
          >
            <span style={{ color: "#6c757d", marginRight: "8px" }}>
              Formulário:
            </span>
            {form.name}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <EditPropertiesBtn id={form.id}/>
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <SaveFormBtn id={form.id} />
                <PublishFormBtn id={form.id}/>
              </>
            )}
          </div>
        </nav>
        <div
          style={{
            display: "flex",
            width: "100%",
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflowY: "auto",
            height: "100%",
            backgroundColor: "#f0f0f0",
          }}
        >
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
}

export default FormBuilder;
