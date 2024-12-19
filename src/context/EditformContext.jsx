import { createContext, useState } from "react";

export const EditformContext = createContext()


export const EditformProvider = function({ children }) {
    const [editable, setEditable] = useState()
    return (
        <EditformContext.Provider value={{ editable, setEditable }}>
            { children }
        </EditformContext.Provider>
    )
}