// import { collection, onSnapshot } from "firebase/firestore"
// import {createContext, useState, useEffect} from "react"
// import { db } from "../../firebaseConfig"

// export const ScheduleContext = createContext()

// export const ScheduleContextProvider = function({ children }) {

//     const [ data, setData ] = useState([])

//     const collectionRef = collection(db, 'schedule')
//     useEffect(() => {
//         const unsubscribe = onSnapshot( collectionRef, snap => {
//             const snapData = snap.docs.map( index => ({
//                 documentID: index.id,
//                 ...index.data()
//             }))
//             setData(snapData)
//         })
//         return ()=> unsubscribe()
//     }, [])
//     return (
//         <ScheduleContext.Provider value={{ data }}>
//             { children }
//         </ScheduleContext.Provider>
//     )
// }


import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { createContext, useState, useEffect } from "react";
import { db } from "../../firebaseConfig";

export const ScheduleContext = createContext();

export const ScheduleContextProvider = function ({ children }) {
  const [data, setData] = useState([]);

  const collectionRef = collection(db, "schedule");

  useEffect(() => {
    const unsubscribe = onSnapshot(collectionRef, (snap) => {
      const snapData = snap.docs.map((index) => ({
        documentID: index.id,
        ...index.data(),
      }));
      setData(snapData);
    });
    return () => unsubscribe();
  }, []);


  return (
    <ScheduleContext.Provider value={{ data }}>
      {children}
    </ScheduleContext.Provider>
  );
};
