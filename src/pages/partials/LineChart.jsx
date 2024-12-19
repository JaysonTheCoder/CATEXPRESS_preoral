
// import React, { useEffect, useState, useContext } from 'react';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// import { collection, onSnapshot, doc } from 'firebase/firestore';
// import { db } from '../../../firebaseConfig';
// import { GenerateTimeContext } from '../../context/generateTimeContext';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const BarChart = function () {
//     const { year } = useContext(GenerateTimeContext);
//     const [chartData, setChartData] = useState({
//         labels: [],
//         datasets: [
//             {
//                 label: 'Green (Revenue)',
//                 data: [],
//                 backgroundColor: '#14D581',
//             },
//             {
//                 label: 'Purple (Expenses)',
//                 data: [],
//                 backgroundColor: '#580dad',
//             },
//         ],
//     });

//     useEffect(() => {
//         const months = [];
//         const revenueData = [];
//         const expensesData = [];
//         const tempExpenses = {}; // Temporary storage for real-time expense aggregation
//         const monthNames = [
//             "January", "February", "March", "April", "May", "June",
//             "July", "August", "September", "October", "November", "December"
//         ];

//         let unsubscribeRevenue = null;
//         let unsubscribeReports = null;

//         // Real-time listener for revenue
//         const fetchRevenue = () => {
//             unsubscribeRevenue = onSnapshot(collection(db, 'revenue'), (snapshot) => {
//                 months.length = 0;
//                 revenueData.length = 0;
                
//                 snapshot.forEach((doc) => {
//                     const data = doc.data();
//                     months.push(doc.id); // Month is the document ID
//                     revenueData.push(data.revenue);
//                 });

//                 updateChartData();
//             });
//         };

//         // Real-time listener for expenses
//         const fetchExpenses = () => {
//             unsubscribeReports = onSnapshot(
//                 collection(db, `reports/${year}/Months`), // Year changes dynamically
//                 (snapshot) => {
//                     snapshot.forEach((doc) => {
//                         const monthData = doc.data();
//                         const days = monthData.days || {}; // Ensure 'days' is defined

//                         // Calculate total expenses for this month
//                         const totalExpenses = Object.values(days).reduce(
//                             (sum, day) => sum + (day.expenses || 0), 0
//                         );

//                         // Store in tempExpenses by month name
//                         tempExpenses[doc.id] = totalExpenses;
//                     });

//                     updateChartData();
//                 }
//             );
//         };

//         // Function to update chart data
//         const updateChartData = () => {
//             const alignedExpenses = months.map((month) => tempExpenses[month] || 0);
//             expensesData.length = 0;
//             expensesData.push(...alignedExpenses);

//             setChartData({
//                 labels: months, // Use the full month names for the labels
//                 datasets: [
//                     {
//                         label: 'Green (Revenue)',
//                         data: revenueData,
//                         backgroundColor: '#14D581',
//                     },
//                     {
//                         label: 'Purple (Expenses)',
//                         data: expensesData,
//                         backgroundColor: '#580dad',
//                     },
//                 ],
//             });
//         };

//         // Fetch data
//         fetchRevenue();
//         fetchExpenses();

//         // Cleanup listeners on unmount
//         return () => {
//             if (unsubscribeRevenue) unsubscribeRevenue();
//             if (unsubscribeReports) unsubscribeReports();
//         };
//     }, [year]); // Dependency on year

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//             title: {
//                 display: true,
//                 text: `Monthly Revenue and Expenses Overview (${year})`,
//             },
//         },
//         scales: {
//             x: {
//                 beginAtZero: true,
//             },
//         },
//     };

//     return chartData && <Bar style={{ maxWidth: '70%', maxHeight: 500 }} data={chartData} options={options} />;
// };

// export { BarChart };




import React, { useEffect, useState, useContext } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { GenerateTimeContext } from '../../context/generateTimeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = function () {
    const { year } = useContext(GenerateTimeContext);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Green (Revenue)',
                data: [],
                backgroundColor: '#14D581',
            },
            {
                label: 'Purple (Expenses)',
                data: [],
                backgroundColor: '#580dad',
            },
        ],
    });

    useEffect(() => {
        const months = [];
        const revenueData = [];
        const expensesData = [];
        const tempRevenue = {};
        const tempExpenses = {};
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        let unsubscribeReports = null;

        // Real-time listener for revenue and expenses
        const fetchReports = () => {
            unsubscribeReports = onSnapshot(
                collection(db, `reports/${year}/Months`), // Year changes dynamically
                (snapshot) => {
                    snapshot.forEach((doc) => {
                        const monthData = doc.data();
                        const days = monthData.days || {}; // Ensure 'days' is defined

                        // Calculate total revenue and expenses for this month
                        const totalRevenue = Object.values(days).reduce(
                            (sum, day) => sum + (day.revenue || 0), 0
                        );
                        const totalExpenses = Object.values(days).reduce(
                            (sum, day) => sum + (day.expenses || 0), 0
                        );

                        // Store in tempRevenue and tempExpenses by month name
                        tempRevenue[doc.id] = totalRevenue;
                        tempExpenses[doc.id] = totalExpenses;
                    });

                    updateChartData();
                }
            );
        };

        // Function to update chart data
        const updateChartData = () => {
            const alignedRevenues = monthNames.map((month) => tempRevenue[month] || 0);
            const alignedExpenses = monthNames.map((month) => tempExpenses[month] || 0);

            months.length = 0;
            months.push(...monthNames);

            revenueData.length = 0;
            revenueData.push(...alignedRevenues);

            expensesData.length = 0;
            expensesData.push(...alignedExpenses);

            setChartData({
                labels: months, // Use the full month names for the labels
                datasets: [
                    {
                        label: 'Green (Revenue)',
                        data: revenueData,
                        backgroundColor: '#14D581',
                    },
                    {
                        label: 'Purple (Expenses)',
                        data: expensesData,
                        backgroundColor: '#580dad',
                    },
                ],
            });
        };

        // Fetch data
        fetchReports();

        // Cleanup listeners on unmount
        return () => {
            if (unsubscribeReports) unsubscribeReports();
        };
    }, [year]); // Dependency on year

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Monthly Revenue and Expenses Overview (${year})`,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
        },
    };

    return chartData && <Bar style={{ maxWidth: '70%', maxHeight: 500 }} data={chartData} options={options} />;
};

export { BarChart };
