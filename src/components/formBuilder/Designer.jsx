import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { idGenerator } from "../../lib/idGenerator";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import DesignerSidebar from "./DesignerSideBar";
import FormElements from "./FormElements";
import useDesigner from "./hooks/useDesigner";

const Designer = () => {
  const {
    elements,
    addElement,
    selectedElement,
    setSelectedElement,
    removeElement,
  } = useDesigner();

  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea =
        over.data?.current?.isDesignerDropArea;

      const droppingSidebarBtnOverDesignerDropArea =
        isDesignerBtnElement && isDroppingOverDesignerDropArea;

      if (droppingSidebarBtnOverDesignerDropArea) {
        const type = active.data?.current.type;

        const newElement = FormElements[type].construct(idGenerator());

        if (!newElement) {
          console.error("New element could not be constructed.");
          return;
        }

        addElement(elements.length, newElement);
        return;
      }

      const isDroppingOverDesignerElementTopHalf =
        over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf =
        over.data?.current?.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf ||
        isDroppingOverDesignerElementBottomHalf;

      const droppingSidebarBtnOverDesignerElement =
        isDesignerBtnElement && isDroppingOverDesignerElement;

      if (droppingSidebarBtnOverDesignerElement) {
        const type = active.data?.current.type;

        const newElement = FormElements[type].construct(idGenerator());

        if (!newElement) {
          console.error("New element could not be constructed.");
          return;
        }

        const overId = over.data?.current?.elementId;

        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (overElementIndex === -1) {
          throw new Error("Elemento não encontrado!");
        }

        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }

        addElement(indexForNewElement, newElement);
        return;
      }

      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;

      const draggingDesignerElementOverAnotherDesignerElement =
        isDroppingOverDesignerElement && isDraggingDesignerElement;

      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data?.current?.elementId;
        const overId = over.data?.current?.elementId;

        const activeElementIndex = elements.findIndex(
          (el) => el.id === activeId
        );
        const overElementIndex = elements.findIndex((el) => el.id === overId);

        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error("Elemento não encontrado");
        }

        const activeElement = { ...elements[activeElementIndex] };
        removeElement(activeId);

        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }

        addElement(indexForNewElement, activeElement);
      }
    },
  });

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <div
          style={{ padding: "16px", width: "100%" }}
          onClick={() => {
            if (selectedElement) setSelectedElement(null);
          }}
        >
          <div
            ref={droppable.setNodeRef}
            className={cn(
              "bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
              droppable.isOver && "ring-4 ring-primary ring-inset"
            )}
          >
            {!droppable.isOver && elements.lenght === 0 && (
              <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
                Largue aqui
              </p>
            )}
            {droppable.isOver && elements.lenght === 0 && (
              <div className="p-4 w-full">
                <div className="h-[80px] rounded-md bg-primary/20"></div>
              </div>
            )}
            {elements.length > 0 && (
              <div className="flex flex-col text-background w-full gap-2 p-4">
                {elements.map((element) => (
                  <DesignerElementWrapper key={element.id} element={element} />
                ))}
              </div>
            )}
          </div>
        </div>
      <DesignerSidebar />
    </div>
  );
};

const DesignerElementWrapper = ({ element }) => {
  const { removeElement, selectedElement, setSelectedElement } = useDesigner();

  const [mouseIsOver, setMouseIsOver] = useState(false);

  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  if (draggable.isDragging) return null;

  const DesignerElement = FormElements[element.type].designerComponent;

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
    >
      <div
        ref={topHalf.setNodeRef}
        className="absolute w-full h-1/2 rounded-t-md"
      />
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute w-full bottom-0 h-1/2 rounded-b-md"
      />
      {mouseIsOver && (
        <>
          <div className="absolute right-0 h-full">
            <Button
              variant={"outline"}
              className="flex justify-center h-full border rounded-md rounded-l-none bg-red-500"
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
              }}
            >
              <FaTrash className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className="text-muted-foreground text-sm">
              Clique para ver as propriedades ou segure para mover
            </p>
          </div>
        </>
      )}
      {topHalf.isOver && (
        <div className="absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none" />
      )}
      <div
        className={cn(
          "flex w-full h-[120px] items center rounded-md bg-accent/40 px-4 py-2 pointer-events-none",
          mouseIsOver && "opacity-30"
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>
      {bottomHalf.isOver && (
        <div className="absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none" />
      )}
    </div>
  );
};

export default Designer;
