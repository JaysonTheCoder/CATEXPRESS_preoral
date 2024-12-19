


import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

function AddForm({ close }) {
  const [address, setAddress] = useState('');
  const [largestCurrent, setLargestCurrent] = useState(null);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'credentials'), (snap) => {
      const currents = [];
      snap.forEach(data => {
        currents.push(parseInt(data.data().current));
      });

      if (currents.length > 0) {
        setLargestCurrent(Math.max(...currents));
      } else {
        setLargestCurrent(0)
      }
    });

    return () => unsubscribe()
  }, []);

  function generateCustomId(year, counter) {
    const paddedCounter = String(counter).padStart(3, '0');
    return `${year}${paddedCounter}`;
  }

  const handleSave = async () => {
    if (!address || !firstname || !lastname || !username || !password) {
      console.error('All fields are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const today = new Date();
      const year = today.getFullYear();
      const dateCreated = today.toISOString().split('T')[0]; 

      const nextCounter = largestCurrent !== null ? largestCurrent + 1 : 1; 
      const operatorId = generateCustomId(year, nextCounter);

      const hashedPassword = await bcrypt.hash(password, 5);

      await addDoc(collection(db, 'credentials'), {
        operator_id: operatorId,
        address: address,
        firstname: firstname,
        lastname: lastname,
        email: username,
        password: hashedPassword, // Save hashed password
        date_created: dateCreated,
        current: nextCounter,
        active: false
      });

      console.log('Data saved successfully');
      close();
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-form-container">
      <div className="wrap-add-form">
        <div className="add-form-title">
          <p>Add form</p>
        </div>
        <div className="form">
          <div className="row-1 row">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              disabled={isSubmitting}
            />
          </div>
          <div className="row-2 row">
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="Firstname"
              disabled={isSubmitting}
            />
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Lastname"
              disabled={isSubmitting}
            />
          </div>
          <div className="row-3 row">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              disabled={isSubmitting}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={isSubmitting}
            />
          </div>
          <div className="row-4 row">
            <button onClick={close} disabled={isSubmitting}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddForm;
