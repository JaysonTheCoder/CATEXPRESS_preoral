import React, { useState, useEffect, useContext } from 'react'
import { db } from '../../../firebaseConfig'
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { EditformContext } from '../../context/EditformContext'
import Loader from './Loader'


function Editform({ close }) {
    const { editable } = useContext(EditformContext)
    const [bus_number, setBus_number ] = useState("")
    const [address, setAddress ] = useState("")
    const [firstname, setFirstname ] = useState("")
    const [lastname, setlastname ] = useState("")
    const [username, setusername ] = useState("")
    const [password, setpassword ] = useState("")
    const [loading, isLoading ] = useState(false)
    const [ submit, setSubmit ] = useState(false)

    async function deleteHandler(documentId) {
        isLoading(true)
        const docRef = doc(db, "credentials", documentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          deleteDoc(docRef)
            .then(() => {
              console.log("Document successfully deleted!");
              close()
              isLoading(false)
            })
            .catch((error) => {
              console.error("Error deleting document: ", error);
              isLoading(false)
            });
        } else {
          console.log("Document does not exist.");
          isLoading(false)
        }
      }
    useEffect(()=> {
        console.log("editable: ",editable)
        try {
            if(submit) {
                isLoading(true)
                updateDoc(doc(db, "credentials", editable), {
                    bus_number: bus_number,
                    address: address,
                    firstname: firstname,
                    lastname: lastname,
                    email: username,
                    password: password
                })
                console.log("ok");
                close()
                isLoading(false)
            }
            
        } catch(e) {
            console.log("ERROR: ",e);
            isLoading(false)
        }
    }, [submit])



  return (
    <div className="edit-form-container">
        {
            loading && <Loader />
        }
        <div className="wrap-edit-form">
            <div className="edit-form-title">
                <p>Edit form</p>
                <button onClick={() => deleteHandler(editable)}>delete</button>
            </div>
            <div className="form">
                <div className="row-1 row">
                    <input type="number" value={bus_number} onChange={(e)=>setBus_number(e.target.value)} placeholder='bus number'/>
                    <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} placeholder='address'/>
                </div>
                <div className="row-2 row">
                    <input type="text" value={firstname} onChange={(e)=>setFirstname(e.target.value)} placeholder='firstname'/>
                    <input type="text" value={lastname} onChange={(e)=>setlastname(e.target.value)} placeholder='lastname'/>
                </div>
                <div className="row-3 row">
                    <input type="text" value={username} onChange={(e)=>setusername(e.target.value)} placeholder='username'/>
                    <input type="text" value={password} onChange={(e)=>setpassword(e.target.value)} placeholder='password'/>
                </div>
                <div className="row-4 row">
                    <button onClick={()=> close() }>cancel</button>
                    <button onClick={()=>setSubmit(true)}>save</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Editform