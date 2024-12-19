


import { useEffect, useState, useContext, useCallback } from 'react';
import FixedDrawer from "./partials/Drawer"; // Drawer component for the layout
import { db } from '../../firebaseConfig'; // Firebase configuration and Firestore instance
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import ReportFilter from './partials/DropDownSelector'; // Dropdown for filtering reports
import { DropdownContext } from '../context/DropDownContext'; // Context to manage dropdown state
import Loader from './partials/Loader';
import PrintIcon from '@mui/icons-material/Print';
export default function Reports() {
  const [data, setData] = useState([]); // State to store fetched report data
  const { monthSelected, yearSelected, setMonthSelected, setYearSelected } = useContext(DropdownContext); // Context values for selected month and year
  const [loading, setLoading] = useState(false);

  // Helper function to normalize nested data into a single array
  const normalizeData = (nestedData) => {
    return nestedData.flatMap((item) => (Array.isArray(item) ? item : [item]));
  };

  // Fetch all reports (merge months and years data)
  const fetchAllReports = useCallback(async () => {
    setLoading(true);
    const reportsCollectionRef = collection(db, 'reports'); // Firestore path for all reports
    const allReports = [];

    const snapshot = await getDocs(reportsCollectionRef); // Fetch all documents in the 'reports' collection

    // Loop through each document (each year)
    for (const yearDoc of snapshot.docs) {
      const yearData = { id: yearDoc.id, ...yearDoc.data() };

      const monthsCollectionRef = collection(db, `reports/${yearDoc.id}/Months`);
      const monthsSnapshot = await getDocs(monthsCollectionRef);
      const monthsData = [];

      monthsSnapshot.forEach((monthDoc) => {
        monthsData.push({
          id: monthDoc.id,
          ...monthDoc.data()
        });
      });

      allReports.push(...monthsData); // Add all months for the year to the array
    }

    setData(allReports); // Update state with the complete data
    setLoading(false);
  }, []);

  // Fetch reports by selected year (with real-time updates)
  const fetchReportsByYear = useCallback(() => {
    setLoading(true);
    if (!yearSelected) {
      setLoading(false);
      return; // Return early if no year is selected
    }

    const monthCollectionRef = collection(db, `reports/${yearSelected}/Months`);
    const unsubscribe = onSnapshot(monthCollectionRef, (snapshot) => {
      const yearData = [];
      snapshot.forEach((doc) => {
        yearData.push({ id: doc.id, ...doc.data() });
      });
      setData(yearData); // Update state with year data
      setLoading(false);
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
  }, [yearSelected]);

  // Fetch reports for a specific month
  const fetchReportsByMonth = useCallback(async () => {
    setLoading(true);
    if (!yearSelected || !monthSelected) {
      setLoading(false);
      return;
    }

    const monthCollectionRef = collection(db, `reports/${yearSelected}/Months`);
    const querySnapshot = await getDocs(monthCollectionRef);
    const monthData = [];

    querySnapshot.forEach((doc) => {
      if (doc.id === monthSelected) {
        monthData.push({ id: doc.id, ...doc.data() });
      }
    });

    setData(monthData); // Update state with selected month data
    setLoading(false);
  }, [yearSelected, monthSelected]);

  // Effect to determine what data to fetch based on selected filters
  useEffect(() => {
    let unsubscribe;

    if (yearSelected && monthSelected) {
      fetchReportsByMonth(); // Fetch data for specific month
    } else if (yearSelected) {
      unsubscribe = fetchReportsByYear(); // Fetch yearly data with real-time updates
    } else {
      fetchAllReports(); // Fetch all reports (years and months)
    }

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe(); // Clean up real-time listener
      }
    };
  }, [fetchReportsByMonth, fetchReportsByYear, fetchAllReports, monthSelected, yearSelected]);

  const handleFilterChange = ({ type, value }) => {
    if (type === "month") setMonthSelected(value);
    if (type === "year") setYearSelected(value);
  };

  const calculateTotalRevenue = () => {
    const totalRevenue = data.reduce((total, report) => {
      const dailyRevenues = Object.values(report.days || {}).reduce((dayTotal, day) => {
        return dayTotal + (day.revenue || 0);
      }, 0);
      return total + dailyRevenues;
    }, 0);
  
    // Format as Philippine currency with 2 decimal places
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(totalRevenue);
  };
  
  const handlePrint = () => {
    const printContent = document.getElementById('report-table-container').innerHTML;
    const totalRevenue = calculateTotalRevenue();
  
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Reports</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Reports</h1>
          ${printContent}
          <h2>Total Revenue: ${totalRevenue}</h2>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  
  const drawerWidth = 240;

  return (
    <div className="container">
      {loading && <Loader />}
      <div className="content" style={{ marginLeft: drawerWidth }}>
        <div className="app-bar">
          <div className="title" style={{flex: 1}}>
            <p>Reports</p>
          </div>
          
        </div>
        <div className="main">
          <div className="report-container" id="report-table-container">
            <div className="report-banner">
              <div className="report-banner-title">
                <h3>{yearSelected || "All Years"}</h3>
                <p>{monthSelected ? `Monthly Reports (${monthSelected})` : "Yearly Reports"}</p>
              </div>
              <div className="drop-down-selector">
                <ReportFilter onFilterChange={handleFilterChange} />
                <div className="print-button">
                  <button onClick={handlePrint} style={{ padding: '8px 16px', cursor: 'pointer', background: 'transparent', border: 'none', margin: 10 }}>
                    <PrintIcon style={{ marginRight: 8 }} />
                  </button>
                </div>
              </div>
            </div>
            {data.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>Conductor Name</th>
                    <th>Bus number</th>
                    <th>Route</th>
                    <th>Trips</th>
                    <th>Expenses</th>
                    <th>Time reported</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.flatMap((report) =>
                    Object.values(report.days || {}).map((dayData, idx) => (
                      <tr key={`${report.id}-${idx}`}>
                        <td>{dayData.id}</td>
                        <td>{dayData.name}</td>
                        <td>{dayData.bus_number}</td>
                        <td>{dayData.route}</td>
                        <td>{dayData.trips}</td>
                        <td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(dayData.expenses || 0)}</td>

                        <td>
                          {`${String(dayData.time_reported.month).padStart(2, '0')}-${String(dayData.time_reported.day).padStart(2, '0')}-${dayData.time_reported.year}`}
                        </td>
                        <td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(dayData.revenue || 0)}</td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p>No reports available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <FixedDrawer drawerWidth={drawerWidth} />
    </div>
  );
}
