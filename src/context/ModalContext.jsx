import { createContext, useState } from "react";


export const ModalLogoutContext = createContext()

export const ModalLogoutContextProvider = function({ children }) {
    const [showModal, setShowModal] = useState(false)

    return (
        <ModalLogoutContext.Provider value={{ setShowModal, showModal }}>
            { children }
        </ModalLogoutContext.Provider>
    )
}