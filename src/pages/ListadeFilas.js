import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../components/configFirebase';
import { Auth } from '../context/ContextProvider';


export default function ListadeFilas() {
  const {borrarFila,crearFila,boxCollectionRef}=Auth()
  const [ filasList , setFilasList]=useState([])
  const [ fila , setFila]=useState([])


  const handleChange =({target: {name,value}})=>{
    setFila({...fila,[name]:value});
   
 }
const handleDelete=(fila)=>{

borrarFila(fila)
}
useEffect(()=>{
 
    onSnapshot(doc(db,"box&filas","filas&box"), (doc)=>{
      setFilasList(doc.data().filas)
    })
   
 
},[])

  return (
    <div className="flex gap-2 ">
      <div className=" w-1/3 py-4 h-1/4 bg-gray-50">
      <form action="" className="w-full " htmlFor="filaCreator" name='filaCreator'>
        <h2 className="pl-1 py-2   text-left font-bold text-xl leading-4 font-medium text-gray-500 uppercase tracking-wider">Formulario Creador de Filas</h2>
        <label htmlFor="filas" className=" pl-1 py-4 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Nombre de Fila</label>
        <input onChange={handleChange} type="text" name="fila" id="filas" className="px-4 w-11/12 border  border-slate-300 hover:shadow-lg ml-1  focus:outline-none duration-300 h-10 rounded-md "/>
        <button 
        name="filaCreator"
        onClick={(e)=>{
          e.preventDefault();
          crearFila(fila.fila)
          e.target.reset()
        }}
        className=" px-3 my-2 ml-1 bg-blue-400  hover:bg-blue-500 active:bg-blue-600 focus:outline-none focus:ring focus:ring-cyan-300 rounded-lg p-2 text-white duration-300 font-bold">
          Crear Fila
        </button>
    
      </form>
      </div>
      <table className="w-2/3">
        <thead>
          <tr>
            <th className="px-6  border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              N°
            </th>
            <th className="px-6  border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Nombre de Fila
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50">Accion</th>
          </tr>
        </thead>

        <tbody className="bg-white">

         {

           !filasList?<span className="absolute font-bold text-2xl">Loading...</span>:
           filasList.map((fila,i) =>(

           
          <tr 
          key={i}
          className="hover:bg-gray-50 duration-300 cursor-pointer">
            <td className="px-6 py-4 whitespace-no-wrap font-medium border-b border-gray-200"> {filasList.indexOf(fila)+1}</td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="text-sm leading-5 uppercase font-medium text-gray-900">
                  { fila}
                  </div>
            </td>

      
            <td className="px-6 py-4 whitespace-no-wrap text-center  border-b border-gray-200 text-sm leading-5 font-medium">
              <button 
              className="text-indigo-600 hover:text-indigo-900"
              onClick={()=>handleDelete(fila)}>
                Delet
                </button>
           
            </td>
            
          </tr>
          ))
        }
        </tbody>
      </table>
    </div>
  );
}
