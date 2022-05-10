import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar ,Line} from "react-chartjs-2";
// import faker from 'faker';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: false,
    },
  },
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  scales: {
    x: {
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
};


const incialDate=[
    "2022-05-01",
    "2022-05-02",
    "2022-05-03",
    "2022-05-04",
    "2022-05-05",
    "2022-05-06",
    "2022-05-07",
  ]
export default function SemanaChart({ registro }) {
  // const [turnos, setTurnos] = useState([]);
  const [dateFilter, setDateFilter] = useState(false)
  
  const datapoints=[]    
  const labels =registro?.map(dia=>{
    const data=dia?.dia?.seconds*1000
    const date = new Date(data)
    return date.toISOString().slice(0,10)
  });
  // console.log(labels)
  const [labels2, setLabels2] = useState([...labels])

  const handleFilter = ({ target: { name, value } }) => {
    console.log(labels2);
    if (name === "startDate") {
     setDateFilter({
         ...dateFilter, startDate:value
     })
    } else {
        setDateFilter({
          ...dateFilter, endDate:value
        })
    }

  
};
const handleSubmit= async () => {
    const indexStartDate=labels2.indexOf(dateFilter.startDate)
    const indexEndtDate=labels2.indexOf(dateFilter.endDate)
    const arrayData=labels2.slice(indexStartDate,indexEndtDate+1)
arrayData.length>0&&setLabels2(arrayData)
    
  }

  // 
  const data = {
    labels:labels2,
    datasets: [
      {
        label: "Cola de Espera",
        data:registro?.map(turno=>turno.totalTurnos),
        backgroundColor: "#06B6D4",
        borderColor: "#00A6ED",
        borderWidth: 2,
        stack: "Stack 0",
      },
    ],
  };

  return (
    <div className="w-2/3 mx-auto py-5">
      <Line options={options} data={data} />
      <label htmlFor="filtro" className="flex  pt-5 h-12 w-full py-0 justify-around mx-auto " >
        <input
          type="date"
          name="startDate"
          className=" mx-2 rounded-lg px-3 font-bold text-sm outline-none bg-gray-50 shadow-sm mx-auto "
          onChange={handleFilter}
          required
        />
        <input
          type="date"
          name="endDate"
          className=" mx-2 rounded-lg px-3 font-bold text-sm outline-none bg-gray-50 shadow-sm mx-auto "
          onChange={handleFilter}
          required
        />
        <button onClick={handleSubmit}
        
         className=" px-3  bg-blue-400 hover:bg-blue-500 active:bg-blue-600 focus:outline-none focus:ring focus:ring-cyan-300 rounded-lg px-3 text-white duration-300 font-medium">
            filtrar</button>
      </label>
    </div>
  );
}
