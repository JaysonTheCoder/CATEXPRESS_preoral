



import React, { useContext, useState } from "react";
import { AddScheduleContext } from "../../context/AddScheduleContext";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { ScheduleContext } from "../../context/ScheduleContext";
import { LoadingContext } from "../../context/loadingContext";
import Loader from "./Loader";

export default function AddSchedule({ docID, indexField }) {
  const { setopenAddScheduleForm } = useContext(AddScheduleContext);
  const { data } = useContext(ScheduleContext);
  const [loading, setLoading] = useState(false);
  const [newFromToOrigin, setNewFromToOrigin] = useState("");
  const [newFromToDestination, setNewFromToDestination] = useState("");
  const [newFromToDeparture, setNewFromToDeparture] = useState("");

  const [newToFromOrigin, setNewToFromOrigin] = useState("");
  const [newToFromDestination, setNewToFromDestination] = useState("");
  const [newToFromDeparture, setNewToFromDeparture] = useState("");

  const [selectedOption, setSelectedOption] = useState("origAndDes");
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};

    if (!newFromToOrigin) newErrors.newFromToOrigin = "Origin is required.";
    if (!newFromToDestination) newErrors.newFromToDestination = "Destination is required.";
    if (!newFromToDeparture) newErrors.newFromToDeparture = "Departure is required.";
    if (!newToFromOrigin) newErrors.newToFromOrigin = "Origin is required.";
    if (!newToFromDestination) newErrors.newToFromDestination = "Destination is required.";
    if (!newToFromDeparture) newErrors.newToFromDeparture = "Departure is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (selectedOption === "origAndDes") {
        await addNewField(docID, indexField, "fromTo", newFromToDestination, newFromToOrigin, newFromToDeparture);
        await addNewField(docID, indexField, "toFrom", newToFromDestination, newToFromOrigin, newToFromDeparture);
      }

      setopenAddScheduleForm(false);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };


  const addNewField = async (documentId, newIndexField, fieldType, des, orig, dep) => {
    try {
      const docRef = doc(db, "schedule", documentId);
      
      // Fetch the current document to check existing fields
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const fieldExists = currentData[fieldType] || {};  // Ensure the field exists
        
          await updateDoc(docRef, {
            [`${fieldType}.${newIndexField}`]: {
              origin: orig,
              destination: des,
              departure: dep,
            },
          });
          console.log(`Field updated successfully in ${fieldType}`);
        
      } else {
        console.error("Document does not exist.");
      }
    } catch (error) {
      console.error("Error adding or updating field:", error);
    }
  };
  

  return (
    <div className="add-sched-container">
      {loading && <Loader />}
      <div className="wrap-form">
        <div className="add-sched-form-title" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '1.5rem', paddingBottom: '0.1rem' }}>
          <h3>Add Schedule - {docID}</h3>
        </div>
        <form
          className="new-sched-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (validateInputs()) {
              handleSubmit();
            }
          }}
          style={{ padding: '0.4rem 0.8rem' }}
        >
          <div className="wrap-1">
            <div className="add-sched-label">
              <p>fromTo</p>
            </div>
            <div className="add-scheds-input-origin">
              <div className="sched-input-labels">
                <p>Origin</p>
                <p>Destination</p>
                <p>Departure</p>
              </div>
              <div className="sched-input-inputs">
                <div className="sched-input">
                  <input
                    required
                    type="text"
                    value={newFromToOrigin}
                    onChange={(e) => setNewFromToOrigin(e.target.value)}
                    placeholder="Origin"
                  />
                  {errors.newFromToOrigin && <p className="error">{errors.newFromToOrigin}</p>}
                </div>
                <div className="sched-input">
                  <input
                    required
                    type="text"
                    value={newFromToDestination}
                    onChange={(e) => setNewFromToDestination(e.target.value)}
                    placeholder="Destination"
                  />
                  {errors.newFromToDestination && <p className="error">{errors.newFromToDestination}</p>}
                </div>
                <div className="sched-input">
                  <input
                    required
                    type="text"
                    value={newFromToDeparture}
                    onChange={(e) => setNewFromToDeparture(e.target.value)}
                    placeholder="Departure"
                  />
                  {errors.newFromToDeparture && <p className="error">{errors.newFromToDeparture}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="wrap-2">
            <div className="add-sched-label">
              <p>toFrom</p>
            </div>
            <div className="add-scheds-input-origin">
              <div className="sched-input-labels">
                <p>Origin</p>
                <p>Destination</p>
                <p>Departure</p>
              </div>
              <div className="sched-input-inputs">
                <div className="sched-input">
                  <input
                    required
                    type="text"
                    value={newToFromOrigin}
                    onChange={(e) => setNewToFromOrigin(e.target.value)}
                    placeholder="Origin"
                  />
                  {errors.newToFromOrigin && <p className="error">{errors.newToFromOrigin}</p>}
                </div>
                <div className="sched-input">
                  <input
                    required
                    type="text"
                    value={newToFromDestination}
                    onChange={(e) => setNewToFromDestination(e.target.value)}
                    placeholder="Destination"
                  />
                  {errors.newToFromDestination && <p className="error">{errors.newToFromDestination}</p>}
                </div>
                <div className="sched-input">
                  <input
                    required
                    type="text"
                    value={newToFromDeparture}
                    onChange={(e) => setNewToFromDeparture(e.target.value)}
                    placeholder="Departure"
                  />
                  {errors.newToFromDeparture && <p className="error">{errors.newToFromDeparture}</p>}
                </div>
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            height: "20%" ,
            alignItems: 'center'
          }}>
            <button
              type="button"
              onClick={() => setopenAddScheduleForm(false)}
              className="close-btn"
              style={{
                cursor: "pointer",
                padding: '0.5rem 1rem',
                borderRadius: '0.3rem',
                background: "#d5d5d5",
                border: 'none'
              }}
            >
              Close
            </button>
            <button
              type="submit"
              className="submit-btn"
              style={{
                cursor: "pointer",
                padding: '0.5rem 1rem',
                borderRadius: '0.3rem',
                background: "#1E90FF",
                width: 250,
                marginRight: '2rem',
                marginLeft: 10,
                border: 'none'
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
