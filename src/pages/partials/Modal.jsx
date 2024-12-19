// import { useState, useContext } from "react";
// import { doc, deleteDoc } from "firebase/firestore";
// import { LoadingContext } from "../../context/loadingContext";
// import Loader from "./Loader";
// import { db } from "../../../firebaseConfig";
// import { useNavigate } from "react-router-dom";


// export const DeleteModal = function({ docID, cancel }) {

//     const navigator = useNavigate()
//     const [loading, isLoading ] = useState(false)


//     const handleDeletion = async function() {
//         isLoading(true)
//         const docRef = await doc(db, "schedule", docID)
//         try {
//             await deleteDoc(docRef)
//             await isLoading(false)
//             await cancel()
//         }catch(err) {
//             isLoading(false)
//         }finally {
//             isLoading(false)
//         }

//     }

//     return (
//         <div className="deleteModal-container">
//             {
//                 loading && <Loader />
//             }
//             <div className="delete-modal">
//                 <div className="modal-delete-header">
//                     <div>
//                         <h3>Confirm delete</h3>
//                     </div>
//                 </div>
//                 <div className="modal-message-delete">
//                     Are you sure you want to delete this Route?
//                 </div>
//                 <div className="modal-buttons-delete">
//                     <button onClick={()=> cancel()}>cancel</button>
//                     <button onClick={()=> handleDeletion()}>confirm</button>
//                 </div>
//             </div>
//         </div>
//     )
// }



// export const LogoutModal = function({ cancel }) {
//     const [loading, isLoading ] = useState(false)



//     const handleLogout = function() {
//         isLoading(true)
//         try {
//             navigator('/')
//             isLoading(false)
//             cancel()
//         }catch(err) {
//             isLoading(false)
//         }finally {
//             isLoading(false)
//         }

//     }

//     return (
//         <div className="modal-container">
//             {
//                 loading && <Loader />
//             }
//             <div className="logout-modal">
//                 <div className="modal-logout-header">
//                     <div>
//                         <h3>Confirm Logout</h3>
//                     </div>
//                 </div>
//                 <div className="modal-message-logout">
//                     Are you sure you want to logout?
//                 </div>
//                 <div className="modal-buttons-logout">
//                     <button onClick={()=> cancel()}>cancel</button>
//                     <button onClick={()=> handleLogout()}>confirm</button>
//                 </div>
//             </div>
//         </div>
//     )
// }


import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import Loader from "./Loader";
import { db } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";

// DeleteModal Component
export const DeleteModal = function ({ docID, cancel }) {
  const [loading, setLoading] = useState(false);

  const handleDeletion = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "schedule", docID); // No need for await here
      await deleteDoc(docRef);
      cancel(); // Call cancel after successful deletion
    } catch (err) {
      console.error("Error deleting document:", err);
    } finally {
      setLoading(false); // Ensure loading is reset in all cases
    }
  };

  return (
    <div className="deleteModal-container">
      {loading && <Loader />}
      <div className="delete-modal">
        <div className="modal-delete-header">
          <div>
            <h3>Confirm Delete</h3>
          </div>
        </div>
        <div className="modal-message-delete">
          Are you sure you want to delete this Route?
        </div>
        <div className="modal-buttons-delete">
          <button onClick={cancel}>Cancel</button>
          <button onClick={handleDeletion}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

// LogoutModal Component
export const LogoutModal = function ({ cancel }) {
  const navigate = useNavigate(); // Correctly use `useNavigate` here
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    try {
      navigate("/"); // Navigate to the home page
      cancel(); // Call cancel after navigation
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      setLoading(false); // Ensure loading is reset
    }
  };

  return (
    <div className="modal-container">
      {loading && <Loader />}
      <div className="logout-modal">
        <div className="modal-logout-header">
          <div>
            <h3>Confirm Logout</h3>
          </div>
        </div>
        <div className="modal-message-logout">
          Are you sure you want to logout?
        </div>
        <div className="modal-buttons-logout">
          <button onClick={cancel}>Cancel</button>
          <button onClick={handleLogout}>Confirm</button>
        </div>
      </div>
    </div>
  );
};
