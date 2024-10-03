import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/animations/Loading";
import Designer from "../../../components/formBuilder/Designer";
import DragOverlayWrapper from "../../../components/formBuilder/DragOverlayWarpper";
import EditPropertiesBtn from "../../../components/formBuilder/EditPropertiesBtn";
import PreviewDialogBtn from "../../../components/formBuilder/PreviewDialogBtn";
import SaveFormBtn from "../../../components/formBuilder/SaveFormBtn";
import useDesigner from "../../../components/formBuilder/hooks/useDesigner";
import { UserTypeContext } from "../../../contexts/UserTypeContext";

function FormBuilder({ form }) {
  const { setElements, setSelectedElement } = useDesigner();
  const [isMaster, setIsMaster] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { userType } = useContext(UserTypeContext);
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

    if (!Array.isArray(userType) || !userType.length) return;

    const userRoles = userType.map((role) => {
      if (typeof role === "object" && role.role) {
        return role.role.name;
      }
      return role;
    });

    const roles = ["Master"];

    const hasRole = userRoles.some((userRole) => roles.includes(userRole));

    setIsMaster(hasRole);

    const readyTimeout = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(readyTimeout);
  }, [form, setElements, setSelectedElement]);

  if (!isReady) {
    return <Loading />;
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
            {isMaster && <EditPropertiesBtn id={form.id} />}
            <PreviewDialogBtn />
            <SaveFormBtn id={form.id} />
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
