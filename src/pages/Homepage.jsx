


import { useEffect, useState, useContext } from 'react';
import FixedDrawer from "./partials/Drawer";
import GroupIcon from '@mui/icons-material/Group';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { db } from "../../firebaseConfig";
import { onSnapshot, collection, doc } from "firebase/firestore";
import Addform from './partials/Addform';
import Editform from './partials/Editform';
import Graphs from './partials/Graphs';
import { PieDataContext } from '../context/getPieData';
import { GetCredentials } from '../context/getCredentialsContext';
import { LogoutModal } from './partials/Modal';
import { ModalLogoutContext } from '../context/ModalContext';

export default function Homepage() {
    const [operators, setOperators] = useState([]);
    const [onlineOperators, setOL] = useState([]);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [openAddForm, setOpenAddForm] = useState(false);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setIsLoading] = useState(false);

    const data = useContext(PieDataContext);
    const { credentials, length } = useContext(GetCredentials);
    const { showModal, setShowModal } = useContext(ModalLogoutContext);

    useEffect(() => {
        // Listen to "operators" collection
        const unsubscribe = onSnapshot(collection(db, "operators"), (snapshot) => {
            const newOperators = [];
            const newOnlineOperators = [];

            snapshot.docs.forEach((doc) => {
                const operatorData = doc.data();
                newOperators.push(operatorData);

                if (operatorData.userOnline) {
                    newOnlineOperators.push(operatorData);
                }
            });

            setOperators(newOperators);
            setOL(newOnlineOperators);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, "reports"), (yearSnapshot) => {
          let newTotalRevenue = 0;
  
          yearSnapshot.docs.forEach((yearDoc) => {
              const monthsRef = collection(db, `reports/${yearDoc.id}/Months`);
  
              const unsubscribeMonths = onSnapshot(monthsRef, (monthsSnapshot) => {
                  let revenueForThisYear = 0; 
  
                  monthsSnapshot.docs.forEach((monthDoc) => {
                      const monthData = monthDoc.data();
  
                      if (monthData.days) {

                          Object.values(monthData.days).forEach((dayReport) => {
                              if (dayReport.revenue) {
                                  revenueForThisYear += dayReport.revenue; 
                              }
                          });
                      }
                  });
                  newTotalRevenue = 0
                  newTotalRevenue += revenueForThisYear;
  
                  // Set the total revenue only after all calculations are done
                  setTotalRevenue((prevTotalRevenue) => {
                      if (newTotalRevenue !== prevTotalRevenue) {
                          return newTotalRevenue; // Update if the total revenue has changed
                      }
                      return prevTotalRevenue; // Avoid unnecessary updates if no change
                  });
              });
  
              return () => unsubscribeMonths(); // Cleanup months listener when a new year comes
          });
      });
  
      return () => unsubscribe(); // Cleanup the main listener when component unmounts or changes
  }, []);
  
  

    const handleOpen = () => setOpenEditForm(true);
    const handleClose = () => setOpenEditForm(false);

    const handleOpenAddform = () => setOpenAddForm(true);
    const handleCloseAddform = () => setOpenAddForm(false);

    const cancelLogout = () => setShowModal(false);

    const drawerWidth = 240;

    return (
        <div className="container">
            {openAddForm && <Addform close={handleCloseAddform} />}
            {openEditForm && <Editform close={handleClose} isLoading={setIsLoading} />}
            {showModal && <LogoutModal cancel={cancelLogout} />}

            <div className="content" style={{ marginLeft: drawerWidth }}>
                <div className="app-bar">
                    <div className="title">Dashboard</div>
                </div>

                <div className="main">
                    <div className="cards">
                        <div className="card card-1">
                            <div className="card-info">
                                <div className="title">
                                    <p>Active conductor</p>
                                    <p>
                                        <GroupIcon fontSize="large" />
                                    </p>
                                </div>
                                <p className="value">
                                    {credentials ? credentials.filter((c) => c.active).length : 0}
                                </p>
                            </div>
                        </div>

                        <div className="card card-2">
                            <div className="card-info">
                                <div className="title">
                                    <p>Total buses</p>
                                    <p>
                                        <DirectionsBusIcon fontSize="large" />
                                    </p>
                                </div>
                                <p className="value">{length}</p>
                            </div>
                        </div>

                        <div className="card card-3">
                            <div className="card-info">
                                <div className="title">
                                    <p>Total conductor</p>
                                    <p>
                                        <GroupIcon fontSize="large" />
                                    </p>
                                </div>
                                <p className="value">{length}</p>
                            </div>
                        </div>

                        <div className="card card-4">
                            <div className="card-info">
                                <div className="title">
                                    <p>Total Revenue</p>
                                    <p>
                                        <FeedbackIcon fontSize="large" />
                                    </p>
                                </div>
                                <p className="value">{`P${totalRevenue.toLocaleString()}`}</p>
                            </div>
                        </div>
                    </div>

                    {data ? <Graphs pieDatas={data} /> : "loading..."}
                </div>
            </div>

            <FixedDrawer drawerWidth={drawerWidth} />
        </div>
    );
}
