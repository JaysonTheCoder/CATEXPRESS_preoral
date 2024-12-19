import { createContext, useState } from "react";

export const LoadingContext = createContext()

export const LoadingContextProvider = function({ children }) {
    const [loading, isLoading] = useState(false)
    return (
        <LoadingContext.Provider value={{ loading, isLoading }}>
            { children }
        </LoadingContext.Provider>
    )
}