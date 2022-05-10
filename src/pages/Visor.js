import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { Link } from 'react-router-dom';
import { db } from '../components/configFirebase';

export default function Visor() {

const [ filasList , setFilasList]=useState([])
const [ventanillasFiltradas,setVentanillasFiltradas]=useState(false)
const handleFilter=(label,value)=>{
  setVentanillasFiltradas({...ventanillasFiltradas,fila:label.map(item=>item.value)})
}
  useEffect(()=>{
    const traerFilas=()=>{
     onSnapshot(doc(db,"box&filas","filas"), (doc)=>
     setFilasList(Object.keys(doc.data()))
      )
    }
traerFilas()   
  },[])

  const options = filasList?.map(items=>
    ( {
        value:items,
       label:items,
     }
      ))
 
  return (
    <div className="backgroundImg w-full h-screen flex align-center justify-center bg-gray-100 box-shado ">
      <div className="w-6/12 z-50 duration-200 containerForm sticky l-5 px-4 bg-white shadow-lg border-2 border-red-200 rounded-lg  m-auto ">
        <hr className="my-4" />
        <h1 className="text-center text-3xl my-4 font-bold text-blue-500">
          {" "}
          Bienvenidos al Sitema de Turnos
        </h1>
        <hr className="my-4" />
        <h1 className="text-center text-xl my-4 font-bold text-gray-700">
          {" "}
          Seleccione la fila
        </h1>
        <hr className="my-4" />
        <div className=" grid grid-cols-3 gap-4 px-5 py-5">
          {
          filasList.length===0?
          <h1 className="text-center font-medium text-red-500 text-2xl">No hay turnos</h1>:
          filasList.map((fila) => (
            <Link
              to={"/visor/" + fila}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {fila}
              <svg
                className="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </Link>
          ))}
        </div>
        <hr />
        <div  className=" mx-auto px-5 py-5">
        <h1 className="pl-1  font-bold ">Personalizar Visor</h1>
              <Select
               isMulti
               ñ
              onChange={handleFilter}
               className=" appearance-nonce rounded  py-2 pl-1 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               options={options}
              />
                 <Link
              to={"/visor/"+ventanillasFiltradas.fila }
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Filas Seleccionadas
            </Link>
        </div>
      </div>
    </div>
  );
}
