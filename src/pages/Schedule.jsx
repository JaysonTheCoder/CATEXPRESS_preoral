import React, { useState, useContext, useEffect } from "react";
import FixedDrawer from "./partials/Drawer";
import Listcard from "./partials/Listcard";
import { ScheduleContext } from "../context/ScheduleContext";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Loader from "./partials/Loader";
import { onSnapshot, collection } from "firebase/firestore";
import { LoadingContext } from "../context/loadingContext";
import { db } from '../../firebaseConfig';
import { AddScheduleContext } from '../context/AddScheduleContext';
import AddSchedule from './partials/AddSchedule';
import { DeleteModal } from "./partials/Modal";

export default function Schedule() {
  const [display, setDisplay] = useState(0);
  const { data } = useContext(ScheduleContext); // Get update function from context
  const [sched, setSched] = useState([]);
  const { loading, isLoading } = useContext(LoadingContext);
  const { setopenAddScheduleForm, openAddScheduleForm } = useContext(AddScheduleContext);
  const [showDeleteModal, setShowModalDelete] = useState(false);

  const handleNext = () => {
    setDisplay((prev) => (prev + 1) % (data?.length || 1)); // Prevent errors if data is empty
  };

  const handleDelete = function () {
    setShowModalDelete(false);
  };
  
  const handleOpenDeleteModal = function () {
    setShowModalDelete(true);
  };

  // Update the departure time
  const handleDepartureEdit = (index, cardType, newDeparture) => {
    // Make a copy of the current schedule
    const updatedData = [...data];

    // Find the correct list to update (fromTo or toFrom)
    if (cardType === "fromTo") {
      listData[index].departure = newDeparture; // Error occurs if listData or listData[index] is undefined
      setListData([...listData]); // Assuming listData is a state variable
    } else if (cardType === "toFrom") {
      updatedData[display].toFrom[index].departure = newDeparture;
    }

    // Set the updated data
    setSched(updatedData);
  };

  // Ensure safe handling of undefined/null values for fromTo and toFrom
  const renderListCards = (listData, cardType) => {
    return listData && Object.values(listData).length > 0 ? (
      Object.values(listData).map((item, index) => (
        item.destination && item.origin && (
          
            <Listcard
              key={index}
              origin={item.origin}
              destination={item.destination}
              departure={item.departure}
              cardIndex={index}
              cardType={cardType}
              docID={data[display].documentID}
              onEditDeparture={(newDeparture) =>
                handleDepartureEdit(index, cardType, newDeparture)
              }
              bus_number={item.bus}
            />
        )
      ))
    ) : null;
  };
  return (
    <div className="container">
      {openAddScheduleForm === true && data[display] && (
        <AddSchedule docID={data[display].documentID} indexField={Object.values(data[display].fromTo || {}).length + 1} />
      )}
      {loading && <Loader />}
      {showDeleteModal && <DeleteModal docID={data[display]?.documentID} cancel={handleDelete} />}
      <div className="content" style={{ marginLeft: 240 }}>
        <div className="app-bar">
          <div className="title">Schedule</div>
        </div>
        <div className="main">
          <div
            className="banner"
            style={{
              width: "100%",
              padding: "20px 40px",
              background: "#fb4",
              flexDirection: "row",
            }}
          >
            <div className="banner-title">
              <div
                className="wrap-banner-title"
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div className="title-ng-banner">
                  <h2>Cat Express</h2>
                  <p>Daily trip schedule</p>
                </div>
              </div>
            </div>
            <div className="banner-action">
              <button onClick={() => setopenAddScheduleForm(true)}>Add</button>
            </div>
          </div>

          <ul>
            {data[display] ? (
              <li>
                {isLoading(false)}
                <div className="card-list">
                  <div className="card-list-title">
                    <div className="card-list-subT" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="wrap-card-list-title">
                        <p>{data[display].documentID}</p>
                        <p>Monday - Sunday</p>
                      </div>
                    </div>
                    <div className="card-list-action">
                      <div className="wrap-card-list-action-button">
                        <button onClick={handleNext}>
                          <p>Next</p>
                          <ArrowForwardIcon style={{ fontSize: "1.1rem", marginLeft: 3 }} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="wrap-going">
                    <div className="table-type-label">
                      <p>{ data[display].fromTo.label }</p>
                    </div>
                    {renderListCards(data[display].fromTo, "fromTo")}
                  </div>
                  <div className="wrap-backing">
                    <div className="table-type-label">
                      <p>{ data[display].toFrom.label }</p>
                    </div>
                    {renderListCards(data[display].toFrom, "toFrom")}
                  </div>
                  
                </div>
              </li>
            ) : (
              isLoading(true)
            )}
          </ul>
        </div>
      </div>
      <FixedDrawer drawerWidth={240} />
    </div>
  );
}
