import {
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/animations/Loading";
import Designer from "../../../components/formBuilder/Designer";
import DragOverlayWrapper from "../../../components/formBuilder/DragOverlayWarpper";
import PreviewDialogBtn from "../../../components/formBuilder/PreviewDialogBtn";
import PublishFormBtn from "../../../components/formBuilder/PublishFormBtn";
import SaveFormBtn from "../../../components/formBuilder/SaveFormBtn";
import useDesigner from "../../../components/formBuilder/hooks/useDesigner";

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
    if (isReady) return;
    if (form.content) {
      const elements = JSON.parse(form.content);
      setSelectedElement(null);
      setElements(elements);
    }

    const readyTimeout = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(readyTimeout);
  }, [form, setElements, setSelectedElement]);

  if (!isReady) {
    return <Loading />;
  }

  const shareUrl = `${window.location.origin}/submit/${form.shareUrl}`;

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
            <PreviewDialogBtn />
            <SaveFormBtn id={form.id} />
            <PublishFormBtn id={form.id} />
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
