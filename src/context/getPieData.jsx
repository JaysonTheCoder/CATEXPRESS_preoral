import { createContext, useState, useEffect, useContext } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

export const PieDataContext = createContext(null);

export const PieDataContextProvider = ({ children }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const collRef = collection(db, 'expenses'); // Corrected path
    const unsubscribe = onSnapshot(collRef, (snapshot) => {

        const a = []
      snapshot.docs.map( index => {
        index.data().data.map( values => {
            a.push(values.value)
        })
        console.log("a: ", index.data().data.map( values => values.value));
        
      })
      setData(a);
      console.log('Updated data:', a);
    });

    return () => unsubscribe();
  }, []);

  return (
    <PieDataContext.Provider value={data}>
      {children}
    </PieDataContext.Provider>
  );
};
