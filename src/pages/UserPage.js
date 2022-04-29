import { arrayRemove, arrayUnion, collection, doc, getDoc, onSnapshot, onSnapshotsInSync, updateDoc } from 'firebase/firestore';
import React, { useCallback, useEffect,useState } from 'react'
import Select from "react-select";
import { db } from '../components/configFirebase';
import { Auth } from '../context/ContextProvider'
import AtendiendoAhora from "./AtendiendoAhora";


export default function Users() {

  const {profileUser, traerVentanillas,traerTurnos}= Auth();
  const [turnos,setTurnos]= useState(false)
  const [turnosDisponibles,setTurnosDisponibles]= useState(false)
  const [coladeEspera,setColadeEspera]= useState(false)
  const [turnosFiltrado,setTurnosFiltrado]= useState([])
const [ventanillas,setVentanillas]=useState(false)
const [ventanillasFiltradas,setVentanillasFiltradas]=useState(false)
const [atendiendoAhora,setAtendiendoAhora]= useState(false)
const colasCollectionRef = doc(db,"box&filas","filas")
const atencionCollectionRef = doc(db,"box&filas","atención")

const handleFilter=(label,value)=>{
  setVentanillasFiltradas({...ventanillasFiltradas,filter:label.map(item=>item.value)})
}

//traer cola de espera
useEffect(()=>{  
  const unsub = onSnapshot(colasCollectionRef, (consulta) => {
    const arrays=Object.values(consulta.data())
    const array = arrays.reduce((accum, items) => accum.concat(items),[]);
    setTurnos(array.sort((a,b)=> a.nTurno>b.nTurno?1:-1))
  })
  return ()=>unsub()
},[])

// traer atendiendo actualmente

useEffect(()=>{
  const traerAtendiendoAhora=async()=>{
    const data=await getDoc(atencionCollectionRef)
    setAtendiendoAhora(data.data().atencion.filter(turno=>turno.atencionUser===profileUser.userName))
  }
traerAtendiendoAhora()
},[turnos])

//traer ventanillas disponibles
useEffect(()=>{
  const traerVen=async()=>{
    const ventanillas=await traerVentanillas()
    setVentanillas(ventanillas.filter(ventanilla=>ventanilla.nombre===profileUser.ventanilla))
      }
  traerVen()
},[])

useEffect(()=>{
  filtrarVentanillas()
},[ventanillasFiltradas])

// useEffect(()=>{
//     cargarturnos()
// },[turnos,ventanillasFiltradas])

const filtrarVentanillas=()=>{
 
  if(ventanillasFiltradas?.filter?.length===0){
    setVentanillasFiltradas(false)
  }}

  //   const cargarturnos=async()=>{
  //   const data=await colaDeEspera()
  //   setTurnosDisponibles(data)
  // }

  // const colaDeEspera=()=>turnos?.filter(turno=>ventanillas[0]?.servicios?.includes(turno.fila))
  

  const handleDeleteTurnos=async (fila, turno)=>{
    
    const consulta =await getDoc(colasCollectionRef)
    const info=consulta.data()[fila]
    console.log()
     await updateDoc(atencionCollectionRef,{atencion:arrayUnion({...info.find(buscado=>buscado.nTurno===turno),ventanilla:ventanillas[0]?.nombre,atencionUser:profileUser.userName})})
     await updateDoc(colasCollectionRef,{[fila]:arrayRemove(info.find(buscado=>buscado.nTurno===turno))})
      
  }

  const options = ventanillas[0]?.servicios.map(items=>
   ( {
       value:items,
      label:items,
    }
     ))

useEffect(()=>{
turnos&&cargarcoladeespera()
},[turnos,ventanillas,ventanillasFiltradas])

    const cargarcoladeespera=()=>{
     setColadeEspera(turnos?.filter((turno) =>
       ventanillas[0]?.servicios?.includes(turno.fila)
     ).filter((turno) => {
       if (!ventanillasFiltradas) return turno;
       if (ventanillasFiltradas?.filter?.includes(turno.fila)) {
         return turno;
       }
     }))
    }

// console.log(turnosDisponibles)
  return (
    <div className="flex gap-2  justify-around  ">
      <div className="flex  flex-col justify-around items-center rounded-lg shadow-md text-center  py-4  bg-gray-50  pt-6 pb-8 ">
        <h2 className=" py-2 leading-5 font-bold text-xl font-medium text-gray-500 uppercase tracking-wider">
          Cola de Espera
        </h2>
        <h2 className=" py-2 leading-5  text-center font-bold  font-medium text-gray-500 uppercase tracking-wider">
          Filtrar por Filas
        </h2>
        <Select
          isMulti
          ñ
          onChange={handleFilter}
          className=" appearance-nonce rounded  py-2 pl-1 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          options={options}
        />

        <table className="w-full">
          <thead>
            <tr>
              <th className="px-3  border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                N°
              </th>
              <th className="px-3  border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                N°Turno
              </th>
              <th className="px-3  border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Fila
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                Nombre
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {turnos ? 
              turnos
                .filter((turno) =>
                  ventanillas[0]?.servicios?.includes(turno.fila)
                )
                .filter((turno) => {
                  if (!ventanillasFiltradas) return turno;
                  if (ventanillasFiltradas?.filter?.includes(turno.fila)) {
                    return turno;
                  }
                })
                .map((turn,i) => (
                  <tr className="hover:bg-gray-50 duration-300 cursor-pointer">
                    <td className="px-3 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 uppercase font-medium text-gray-900">
                        {i+1}
                      </div>
                    </td>{" "}
                    <td className="px-3 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 uppercase font-medium text-gray-900">
                        {turn.nTurno}
                      </div>
                    </td>{" "}
                    <td className="px-3 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 uppercase font-medium text-gray-900">
                        {turn.fila}
                      </div>
                    </td>{" "}
                    <td className="px-3 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 uppercase font-medium text-gray-900">
                        {turn.nombre}
                      </div>
                    </td>
                  </tr>
                ))
             : (
              <svg role="status" className=" px-5 py-5 mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
            )}
          </tbody>
        </table>
      </div>
     
        <AtendiendoAhora
        atendiendoAhora={atendiendoAhora}
        handleDeleteTurnos={handleDeleteTurnos}
        fila={coladeEspera[0]?.fila}
        nTurno={coladeEspera[0]?.nTurno}
        />
     
  
    </div>
  );
}
