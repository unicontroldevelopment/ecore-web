import { useDraggable } from "@dnd-kit/core";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

const SiderBarBtnElement = ({ formElement }) => {
  const { label, icon: Icon } = formElement.designerBtnElement;

  const draggable = useDraggable({
    id: `designer-btn-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  });
  return (
    <Button
      variant={"outline"}
      ref={draggable.setNodeRef}
      className={cn(
        "flex flex-col gap-2 h-[120px] w-[120px] mb-2 cursor-grab",
        draggable.isDragging && "ring-2 ring-primary"
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <Icon className="h-8 w-8 text-primary cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  );
};

export const SiderBarBtnElementDragOverlay = ({ formElement }) => {
  const { label, icon: Icon } = formElement.designerBtnElement;

  return (
    <Button
      variant={"outline"}
      className="flex flex-col gap-2 h-[120px] w-[120px] cursor-grab"
    >
      <Icon className="h-8 w-8 text-primary cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  );
};

export default SiderBarBtnElement;
