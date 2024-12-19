


import { LocationOn } from '@mui/icons-material';
import { GpsFixed } from '@mui/icons-material';
import React, { useState, useContext } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { LoadingContext } from '../../context/loadingContext';
import CancelIcon from '@mui/icons-material/Cancel';

const Listcard = ({ origin, destination, departure, cardType, cardIndex, docID, handleDepartureEdit, bus_number }) => {
  const { isLoading } = useContext(LoadingContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newDeparture, setNewDeparture] = useState(departure);

  const handleSave = async () => {
    if (!newDeparture) {
      alert('Departure time cannot be empty');
      return;
    }

    isLoading(true);
    const documentRef = doc(db, 'schedule', docID);

    try {
      await updateDoc(documentRef, {
        [`${cardType}.${cardIndex + 1}.departure`]: newDeparture,
      });

      setIsEditing(false);
      handleDepartureEdit(newDeparture);
      console.log('Departure updated successfully!');
    } catch (error) {
      console.error('Error updating departure:', error);
    } finally {
      isLoading(false);
    }
  };

  return (
    <div className="sched-list-item">
      <div className="list-item">
        <div className="label">
          <p>Origin</p>
          <p>Destination</p>
          <p>Departure</p>
        </div>
        <div className="list">
          <div className="list-icon">
            <LocationOn sx={{ fontSize: 15, color: 'red' }} />
            <p>{origin}</p>
          </div>
          <div className="list-icon">
            <GpsFixed sx={{ fontSize: 15, color: '#000' }} />
            <p>{destination}</p>
          </div>

          {isEditing ? (
            <div className="edit-section">

              <input
                type="text"
                value={newDeparture}
                onChange={(e) => setNewDeparture(e.target.value)}
                placeholder="Enter new departure time"
              />
              <button onClick={handleSave}>Save</button>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  background: 'lightgrey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  color: '#0009',
                  gap: 1,
                }}
              >
                <CancelIcon style={{ fontSize: '0.9rem' }} />
                Cancel
              </button>
            </div>
          ) : (
            <div className="status" style={{ display: 'flex' }}>
                {
                    bus_number && (
                        <div className="bus-occupied" style={{width: '50%', display: 'flex', alignItems: 'center'}}>
                            <p>{ bus_number }</p>
                        </div>
                    )
                }
              <div className="list-time-departure">
                <p>{departure}</p>
              </div>
              <button onClick={() => setIsEditing(true)}>
                <EditIcon style={{ fontSize: '1rem' }} />
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listcard;
