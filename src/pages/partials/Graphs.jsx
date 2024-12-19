

import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { BarChart } from "./LineChart";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig"
import MonthlyExpensesChart from "./BarHorizontal";






// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, BarElement);

const Graphs = ({ pieDatas }) => {
  const label = ['fuel', 'maintenance', 'salary']
  const total = Object.values(pieDatas).reduce((sum, value) => sum + value, 0);
  const percentages = Object.entries(pieDatas).map(([key, value]) => ({
    category: label[key],
    value,
    percentage: ((value / total) * 100).toFixed(2),
  }));


  // const pieData = {
  //   labels: null,
  //   datasets: [
  //     {
  //       data: percentages.map((item) => item.value),
  //       backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
  //     },
  //   ],
  // };

  
  const barData = {
    labels: percentages.map((item) => item.category),
    datasets: [
      {
        label: "Expense Amount",
        data: percentages.map((item) => item.value),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };
  // Save to Firestore
  // const saveToFirestore = async () => {
  //   const docRef = doc(db, "expenses", "expenseData");
  //   await setDoc(docRef, {
  //     data: percentages,
  //     total,
  //   });
  //   // alert("Data saved to Firestore!");
  // };

  // useEffect(() => {
  //   pieDatas && saveToFirestore();
  // }, [pieDatas]);

  return (
        <div className="graph-container">
            <div className="bar">
                <BarChart />
                
            </div>
            
        </div>
  );
};

export default Graphs;
