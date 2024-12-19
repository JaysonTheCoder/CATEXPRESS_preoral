
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { db } from "../../../firebaseConfig";
import { onSnapshot, collection, doc, getDoc, deleteDoc } from "firebase/firestore";
import { useState, useEffect, useContext } from "react"
import { EditformContext } from "../../context/EditformContext";
import { Add } from "@mui/icons-material";
import { Search } from '@mui/icons-material';

function Table({ openForm, openAddform }) {
    const { setEditable } = useContext(EditformContext)
    const [creds, setCredentials ] = useState([])
    const [searched, setSearched ] = useState('')
    const [ offline, setOffline ] = useState(false)

    useEffect(()=> {
        const get = onSnapshot(collection(db, "credentials"), (snap)=> {
            let data = []
            snap.docs.forEach( index => {
                data.push({doc_id: index.id, ...index.data()})
            })
            if(searched != '') {
                setCredentials(
                    creds.filter((item) =>
                        Object.values(item).some((value) =>
                          value.toString().toLowerCase().includes(searched.toLowerCase())
                        )
                      )
                )
            }
            else {
                setCredentials(data)
            }
            if(creds.length <= 0) {
                setOffline(true)
            }
        })
        
        return ()=> get;
    }, [searched])

    const handleSearch = function() {
        setCredentials(creds.filter((item) => item.name.toLowerCase().includes(searched.toLowerCase())))
    }
  return (
    <div className="table-container">
        <div className="banner">
           <div className="banner-h">
                <div className="banner-title">
                    <p>Conductor Profile</p>
                </div>
                <div className="banner-action">
                    <button className="action" onClick={openAddform}>
                        <Add fontSize="inherit"/>
                        <p>Add</p>
                    </button>
                </div>
           </div>
            <div className="on-banner-table-action">
                <div className="search-bar">
                    <input type="text" value={searched} onChange={(e) => setSearched(e.target.value)} placeholder='search'/>
                    <button onClick={() => handleSearch}>
                        <Search />
                    </button>
                </div>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>operator id</th>
                    <th>firstname</th>
                    <th>lastname</th>
                    <th>email</th>
                    <th>password</th>
                    <th>address</th>
                    <th>status</th>
                    <th>date_created</th>
                    <th>actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    creds.length >= 1 ? creds.map((index) => {
                        return (
                            <tr key={index.doc_id}>
                                <td>{ index.operator_id }</td>
                                <td>{ index.firstname }</td>
                                <td>{ index.lastname }</td>
                                <td>{ index.email }</td>
                                <td>{ index.password }</td>
                                <td>{ index.address }</td>
                                <td style={{color: index.active ? "#0a8a3d" : '#8a0a0a'}}>
                                    { index.active ? "active" : "inactive" }
                                </td>
                                <td>{ index.date_created }</td>
                                <td className="table-action">
                                    <button onClick={() => {
                                        setEditable(index.doc_id);
                                        openForm();
                                    }}>
                                        <EditIcon sx={{color: "#f1f1f1", fontSize: 13}} />
                                        <p>edit</p>
                                    </button>
                                </td>
                            </tr>
                        )
                    }) : null
                }
            </tbody>

            
        </table>
    </div>
  )
}

export default Table