import { ScrollArea } from "../ui/scroll-area";
import FormElementsSidebar from "./FormElementsSidebar";
import useDesigner from "./hooks/useDesigner";
import PropertiesFormSidebar from "./PropertiesFormSidebar";

const DesignerSidebar = () => {
  const { selectedElement } = useDesigner();
  return (
    <ScrollArea className="w-[600px] max-w-[600px] rounded-md border">
      <aside className="w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full">
        {!selectedElement && <FormElementsSidebar />}
        {selectedElement && <PropertiesFormSidebar />}
      </aside>
    </ScrollArea>
  );
};

export default DesignerSidebar;
