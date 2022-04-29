import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState ,Component } from 'react'
import { FiSearch } from 'react-icons/fi';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { db } from '../components/configFirebase';
import { Auth } from '../context/ContextProvider';
import Select from "react-select";
import makeAnimated from 'react-select/animated';




export default function ListadeVentanilla() {
const {crearVentanilla,borrarVentanilla}=Auth()

const [ boxList , setBoxList]=useState([])
const [ serviciosList , setServiciosList]=useState([])
const [ventanilla,setVentanilla]=useState({
  nombre:"",
  servicios:[]
})
 
  const handleChange =({target: {name,value}})=>{
    setVentanilla({...ventanilla,[name]:value, servicios:[value]});
  }
const handleSelect=(label,value)=>{
  setVentanilla({...ventanilla,servicios:label.map(item=>item.value)})
}
const handleDelete=(ventanilla)=>{

  borrarVentanilla(ventanilla)
  }

useEffect(()=>{
  onSnapshot(doc(db,"box&filas","filas&box"), (doc)=>{
    setBoxList(doc.data().Ventanilla)
    setServiciosList(doc.data().filas)
  })
},[])

const options = serviciosList.map(items=>
 ( {
   value:items,
  label:items,}
  ))
//  


  return (
    <div className="flex gap-2 ">
      <div className=" flex w-1/3 py-4  bg-gray-50">
      <form action="" className="w-full ">
        <h2 className="pl-1 py-2 leading-5 ml-1 text-left font-bold text-xl leading-4 font-medium text-gray-500 uppercase tracking-wider">Formulario Creador de Ventanilla</h2>
        <label htmlFor="filas"  className=" ml-1 mt-2 pl-1 py-4 border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          Selecciona Fila
        </label>
  
        <Select 
        isMulti
        onChange={handleSelect}
         className=" appearance-nonce  rounded w-11/12 py-2 pl-1 ml-1 mb-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        options={options}
        
        />
        <label htmlFor="ventanilla"
         className=" pl-1 py-4  border-gray-200 text-left text-xs ml-1 leading-4 font-medium text-gray-500 uppercase tracking-wider">Nombre de Ventanilla</label>
        <input type="text" onChange={handleChange} name="nombre" id="ventanilla" className=" px-4 w-11/12 mb-3 border  border-slate-300 hover:shadow-lg ml-2  focus:outline-none duration-300 h-10 rounded-md "/>
        <button 
        onClick={(e)=>{
          e.preventDefault()
          crearVentanilla(ventanilla)
        }}
        className="  my-2 px-2 ml-1 bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 focus:outline-none focus:ring focus:ring-cyan-300 rounded-lg p-2 text-white duration-300 font-bold">
          Crear Ventanilla
        </button>
    
      </form>
      </div>
      <table className="w-2/3">
        <thead>
          <tr>
            <th className="px-3  border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              N°
            </th>
            <th className="px-3  border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            Ventanilla
            </th>
            <th className="px-3  border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Fila
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50">Accion</th>
          </tr>
        </thead>

     <tbody className="bg-white">

         {

           !boxList?<span className="absolute font-bold text-2xl">Loading...</span>:

        
           boxList.map(box =>(

           
          <tr className="hover:bg-gray-50 duration-300 cursor-pointer">
            <td className="px-3 py-4 whitespace-no-wrap border-b font-medium border-gray-200">{boxList.indexOf(box)+1} </td>
            <td className="px-3 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="text-sm leading-5 uppercase font-medium text-gray-900">
                  {box.nombre}
                  </div>
            </td>
            <td className="px-3 py-4 whitespace-no-wrap border-b border-gray-200">
                  {box.servicios.map(ventanilla=>(
                  <div className="text-sm leading-5 uppercase font-medium text-gray-900">
                    {ventanilla}
                  </div>
                     ))} 
            </td>

      
            <td className="px-6 py-4 whitespace-no-wrap text-center  border-b border-gray-200 text-sm leading-5 font-medium">
              <button
              onClick={()=>handleDelete(box.nombre)}
              className="text-indigo-600  hover:text-indigo-900">
                Delet
              </button>
              {'   |   '}
              <a href="#" className="text-indigo-600 hover:text-indigo-900">
                Edit
              </a>
            </td>
            
          </tr>
          ))
        }
        </tbody> 
      </table>
    </div>
  );
}
