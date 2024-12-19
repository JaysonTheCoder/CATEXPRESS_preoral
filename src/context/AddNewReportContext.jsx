import {createContext, useEffect, useState } from 'react'
import { onSnapshot, collection, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
export const CreateNewReportContext = createContext()
 

export const CreateNewReportContextProvider = function({ children }) {
    const [filteredData, setFilteredData] = useState()
    const [monthSelected, setMonthSelected ] = useState('')
    const [ docID, setDocID] = useState('')
    useEffect(()=>{
        try {
            const collectionRef = collection(db, 'reports')
            if(monthSelected.length > 0 && docID.length > 0) {
                const subs = onSnapshot(collectionRef, (snap) => {
                    var mock = []
                    snap.forEach( index => {
                        if(monthSelected == index.id) {
                            mock.push( index.data())
                        }
                    })
                    setFilteredData(mock)
                })
                return ()=> subs()

            }
        }catch(err) {
            throw err
        }

    }, [monthSelected])
    return (
        <CreateNewReportContext.Provider>
            { children }
        </CreateNewReportContext.Provider>
    )
}