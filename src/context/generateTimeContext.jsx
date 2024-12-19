import { createContext, useEffect, useState } from "react";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const GenerateTimeContext = createContext();

export const GenerateTimeContextProvider = function ({ children }) {
    const [second, setSecond] = useState(null);
    const [minute, setMinute] = useState(null);
    const [hour, setHour] = useState(null);
    const [day, setDay] = useState(null);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null)

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    // Update time every second
    useEffect(() => {
        const intervalId = setInterval(() => {
            const dateInstance = new Date();
            const PHTime = new Date(dateInstance.toLocaleString("en-US", { timeZone: "Asia/Manila" }));
            setSecond(PHTime.getSeconds());
            setMinute(PHTime.getMinutes());
            setHour(PHTime.getHours());
            setDay(PHTime.getDay());
            setMonth(PHTime.getMonth());
            setYear(PHTime.getFullYear())
            console.log("Month: ", PHTime.getMonth() + 1);
        }, 1000);
        
        return () => clearInterval(intervalId); 
    }, []);

    // Firestore subscription
    useEffect(() => {
        const collectionRef = collection(db, "reports");
        // console.log(month);
        
        // const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
        //     const docs = snapshot.docs.map((doc) => ({
        //         id: doc.id,
        //         ...doc.data(),
        //     }));

        //     const exists = docs.some((doc) => doc.id === months[month]);

        //     if (!exists) {

  
        //         setDoc(doc(db, "reports", months[month]), {}).then(() => {
        //             console.log(`Document for ${months[month]} added.`);
        //         }).catch((error) => {
        //             console.error("Error writing document:", error);
        //         });
        //     }
        // });

    }, [second]);

    return (
        <GenerateTimeContext.Provider value={{ second, minute, hour, month, day, year }}>
            {children}
        </GenerateTimeContext.Provider>
    );
};
    