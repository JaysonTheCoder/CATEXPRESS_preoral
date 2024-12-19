import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useState, useEffect } from "react";
import { db } from "../../firebaseConfig";


export const GetCredentials = createContext()




export const GetCredentialsContextProvider = function({ children }) {

    const collectionRef = collection(db, "credentials")
    const [credentials, setCredentials] = useState([])
    const [length, setLength] = useState(0)
    const [active, setActive] = useState([])
    useEffect(()=>{
        const unsubs = onSnapshot(collectionRef, (snap) => {
            var mockCreds = []
            snap.forEach(data => {
                mockCreds.push({
                    name: `${data.data().firstname} ${data.data().lastname}`,
                    operator_id: data.data().operator_id,
                    active: data.data().active
                })
            })
            setCredentials(mockCreds)
            setLength(mockCreds.length)
        })
        return () => unsubs()
    }, [])

    return(
        <GetCredentials.Provider value={{ credentials, length, active }}>
             { children }
        </GetCredentials.Provider>
    )
}