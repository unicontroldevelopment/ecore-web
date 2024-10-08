import { createContext, useState } from "react";

export const DesignerContext = createContext(null);

const DesignerContextProvider = ({children}) => {
    const [elements, setElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);
    const addElement = (index, element) => {
        
        setElements(prev => {
            const newElements = [...prev];
            newElements.splice(index, 0, element)
            return newElements;
        })
    }
    const removeElement = (id) => {
        setElements((prev) => prev.filter((element) => element.id !== id))
    }

    const updateElement = (id, element) => {
        setElements(prev => {
            const newElements = [...prev];
            const index = newElements.findIndex(el => el.id === id);
            newElements[index] = element
            return newElements;
        })
    }

    return <DesignerContext.Provider value={{ elements, addElement, removeElement, selectedElement, setSelectedElement, updateElement, setElements }}>{children}</DesignerContext.Provider>
}

export default DesignerContextProvider;