import { DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React from "react";
import FormElements from "./FormElements";
import { SiderBarBtnElementDragOverlay } from "./SidebarBtnElement";
import useDesigner from "./hooks/useDesigner";

const DragOverlayWrapper = () => {
  const { elements } = useDesigner();
  const [draggableItem, setDraggableItem] = React.useState(null);

  useDndMonitor({
    onDragStart: (event) => {
      setDraggableItem(event.active);
    },
    onDragCancel: () => {
      setDraggableItem(null);
    },
    onDragEnd: () => {
      setDraggableItem(null);
    },
  });

  if (!draggableItem) return null;

  let node = <div>No drag Overlay</div>;
  const isSidebardBtnElement =
    draggableItem.data?.current?.isDesignerBtnElement;

  if (isSidebardBtnElement) {
    const type = draggableItem.data?.current.type;
    node = <SiderBarBtnElementDragOverlay formElement={FormElements[type]} />;
  }

  const isDesignerElement = draggableItem.data?.current?.isDesignerElement;
  if (isDesignerElement) {
    const elementId = draggableItem.data?.current?.elementId;
    const element = elements.find((el) => el.id === elementId);

    if (!element) {
      node = <div>Elemento não encontrado</div>;
    } else {
      const DesignerElementComponent =
        FormElements[element.type].designerComponent;
      node = (
        <div className="flex bg-accent border rounded-md h-[80px] w-full py-2 px-4 opacity-80 pointer pointer-events-none">
          <DesignerElementComponent elementInstance={element} />;
        </div>
      );
    }
  }

  return <DragOverlay>{node}</DragOverlay>;
};

export default DragOverlayWrapper;
