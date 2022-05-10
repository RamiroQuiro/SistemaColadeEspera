import React, { useState } from 'react'
import { Link ,useNavigate, useParams} from 'react-router-dom'
import "./loginDos.css"
import imgLogo from "../img/logoCepsi.png";
import toast, { Toaster } from 'react-hot-toast';
import {Auth} from '../context/ContextProvider';
import { updatePassword } from 'firebase/auth';


export default function LoginDos() {
  const params=useParams()
  const [loginUser, setLoginUser]=useState({
    email: 'rama.exe.13@gmail.com',
    Id:555,
    role: 'regular'
  })
  const navigate= useNavigate()
  
    const{login,user}=Auth()
const handleChange=(e)=> {
  setLoginUser({...loginUser, [e.target.name]:e.target.value})}


const handleSubmit=async (e)=>{
  e.preventDefault()
  try {
     await login(loginUser.email,loginUser.password)
     toast.success('Sesion ingresada correctamente')
     setTimeout(() => {

       navigate('/home')
     },800)
  } catch (error) {
    switch(error.code) {
      case 'auth/invalid-password':
      toast.error('Error en la contraseña',{
        duration: 4000,
        className: 'text-center font-medium',
      })
      break;
      case 'auth/too-many-requests':
      toast.error('Demasiados intentos para este usuario, intente ingresar dentro de 10 min',{
        duration: 4000,
        className: 'text-center font-medium',
      })
      break;
      case 'auth/wrong-password':
        toast.error('Error en la contraseña',{
          duration: 4000,
          className: 'text-center font-medium',
        })
        break;
        default:
        toast.error('Error desconocido')
    }
  }
}


  return (
    <div className="grid banner max-h-screen h-screen grid-cols-12">
      <div className="col-span-3 text-white font-sans font-bold bgColor">
        
        <div className="flex flex-col gap-3 max-h-screen  justify-between">
          <img
            src={imgLogo}
            alt=""
            className="logoLogin h-auto h-28 my-5  mx-auto"
          />
          <form
            onSubmit={handleSubmit}
            className="text-3xl w-full px-5"
          >
           <h1 className="text-gray-900">Ingresar</h1> 
            <div className="">
              <label className="text-sm font-sans text-black font-medium">
                Usuario
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Escribe aquí tu email"
                className="w-full bg-white py-3 px-4 border text-black font-medium rounded shadow text-base font-sans"
              />
            </div>
            <div className="">
              <label className="text-sm font-sans text-black font-medium">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Escribe aqui tu contraseña"
                className="w-full bg-white py-3 px-4 text-black border font-medium rounded shadow text-base font-sans"
              />
              <Link
                to={"/resetaerPass/"+loginUser.email}
                className="text-sm font-sans font-medium text-gray-800 underline"
              >
                ¿Olvidaste la Contraseña?
              </Link> 
            </div>
            {/* <!-- Button --> */}
            <div className="text-lg font-sans  w-full mx-auto pt-10">
              <button
                type="submit"
                className="text-center  font-medium px-5 py-2 bg-blue-500 hover:bg-blue-300 hover:text-gray-500 duration-300 rounded-md text-white"
              >
               {params?.email? 'Resetear Constraseña': 'Ingresar'}
              </button>
            </div>
          </form>
          {/* <!-- Text --> */}
        </div>
      </div>

      {/* <!-- Second column image --> */}
        <Toaster/>
      <div className=" col-span-8 text-white font-sans font-bold">
      </div>
    </div>
  );
}
