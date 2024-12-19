import React, { createContext, useState } from 'react'
import { collection } from 'firebase/firestore'
export const DropdownContext = createContext()



export function DropDownContextProvider({ children }) {
    const [ monthSelected, setMonthSelected ] = useState(0)
    const [ yearSelected, setYearSelected ] = useState(0)
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]



  return (
    <DropdownContext.Provider value={{monthSelected, setMonthSelected, setYearSelected, yearSelected, months}}>
        {children}
    </DropdownContext.Provider>
  )
}
