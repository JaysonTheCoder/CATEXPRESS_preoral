import { createContext, useState } from "react";

export const AddScheduleContext = createContext()


export const AddScheduleContextProvider = function({ children }) {
    const [openAddScheduleForm, setopenAddScheduleForm] = useState(false)
    return (
        <AddScheduleContext.Provider value={{ openAddScheduleForm, setopenAddScheduleForm }}>
            { children }
        </AddScheduleContext.Provider>
    )
}