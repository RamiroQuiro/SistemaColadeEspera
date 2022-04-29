import { collection, doc, getDoc, getDocs, onSnapshot, onSnapshotsInSync, queryEqual } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import {useReactToPrint, ReactToPrint } from "react-to-print";
import { db } from "../components/configFirebase";
import { Auth } from "../context/ContextProvider";
import ComprobanteTurno from "./ComprobanteTurno";
import "./turnero.css"
import { v4 as uuidv4 } from 'uuid';


const initialState={
  nombre: "",
  dni: 0,
  nIngreso: 0,
  fila: "",
 nTurno: uuidv4().slice(0,4)
}
export default function Turnero() {


    const [turno, setTurno] = useState(initialState)
    const [error, setError] = useState("");
    const [filasList,setFilasList]= useState(null)
const [statePrint,setStatePrint]= useState(false)
    const {crearTurno}=Auth()

    const handlePaciente=({target: {name,value}})=>{
      setTurno({...turno,[name]:value});
      }
 

  const handleTurno = async(e) => {
    e.preventDefault();
    await crearTurno(turno.fila,turno).then((data) =>{
      setStatePrint(true)
      window.print()
      setStatePrint(false)
      e.target.reset()
      setTurno({...initialState,nTurno: uuidv4().slice(0,4)})
    })
  };
  
 
  useEffect(()=>{
onSnapshot(doc(db,"box&filas","filas&box"),(doc)=>{
  setFilasList(doc.data().filas)
})
},[])


return (

    <div
   
    className="backgroundImg w-full h-screen flex align-center justify-center bg-gray-100 box-shado " >
      <div
      hidden={statePrint?true:false}
      className="w-6/12 z-50 duration-200 containerForm sticky l-5 px-4 bg-white shadow-lg border-2 border-red-200 rounded-lg  m-auto ">
        <hr className="my-4" />
        <h1 className="text-center my-4 font-bold text-blue-500">
          {" "}
          Bienvenidos al Sitema de Turnos
        </h1>
        <hr className="my-4" />
        <form
        // }
        name="formTurno"
          onSubmit={handleTurno}
          className=" bg-white  rounded  px-8 pt-6 pb-8 mb-4"
        >
          <div 
          
          className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Nombre Y Apellido
            </label>
            <input
              type="text"
              name="nombre"
              placeholder="Ibael Tercero"
              className="shadow appearance-nonce rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handlePaciente}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="nIngreso"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Numero de Ingreso
            </label>
            <input
              type="number"
              name="nIngreso"
              placeholder="xxxxx"
              className="shadow appearance-nonce rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handlePaciente}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="dni"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              DNI
            </label>
            <input
              type="number"
              name="dni"
              placeholder="XX.XXX.XXX"
              className="shadow appearance-nonce rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handlePaciente}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="fila"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Fila
            </label>
            <select
              id="servicios"
              type="select"
              name="fila"
              placeholder="*******"
              className="shadow appearance-nonce rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handlePaciente}>
                   {
                    filasList&&
                    filasList.map(servicios =>(
                          <option value={servicios} id={servicios}>{servicios}</option>

                      ))
                  } 
                   
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded focus:shadow-outline m-auto w-6/12 duration-200 "
            type="submit"
            >
              Ingresar Turno
            </button>
          
          </div>
        </form>

        <p className="text-sm align-center flex justify-between px-4 rounded my-4">
         Pantalla Inicial, para el usuario recepto, ubicado en la puerta , Primer punto de recepcion
        </p>
      
      </div>
      
       <div
       hidden={statePrint?false:true}
       className="z-50 sticky w-2/6 px-2 py-10 bg-white shadow-lg border-2 border-red-200 rounded-lg  m-auto mx-auto ">
    <ComprobanteTurno turno={turno}/>
    </div>
      
      </div>
    
  );
}
