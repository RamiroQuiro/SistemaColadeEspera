import React, { useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import "./loginDos.css"
import imgLogo from "../img/logoCepsi.png";
import toast, { Toaster } from 'react-hot-toast';
import {Auth} from '../context/ContextProvider';


export default function LoginDos() {
  
  const [loginUser, setLoginUser]=useState({
    email: 'rama.exe.13@gmail.com',
    Id:555,
    role: 'regular'
  })
  const navigate= useNavigate()
  
    const{login,user}=Auth()
const handleChange=(e)=> {
  console.log({ [e.target.name]:e.target.value})
  setLoginUser({...loginUser, [e.target.name]:e.target.value})}


const handleSubmit=async (e)=>{
  e.preventDefault()
  try {
     await login(loginUser.email,loginUser.password)
     toast.success('Sesion ingresada correctamente')
     navigate('/home')
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
    <div className="grid banner grid-cols-12">
      <div className="col-span-4 text-white  font-sans font-bold bgColor min-h-screen pl-7">
        
        <div className="grid grid-rows-6 grid-flow-col min-h-screen items-center justify-items-start">
          <img
            src={imgLogo}
            alt=""
            className="logoLogin w-40 absolute top-0 left-5 mt-10 ml-2"
          />
          <form
            onSubmit={handleSubmit}
            className="row-span-4 row-start-2 text-4xl"
          >
            Ingresar
            <div className="pt-10 pr-20">
              <label className="text-sm font-sans text-black font-bold">
                Usuario
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Escribe aquí tu email"
                className="w-full bg-white py-3 px-8 border text-black font-medium rounded shadow text-base font-sans"
              />
            </div>
            <div className="pt-2 pr-20">
              <label className="text-sm font-sans text-black font-bold">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Escribe aqui tu contraseña"
                className="w-full bg-white py-3 px-8 text-black border font-medium rounded shadow text-base font-sans"
              />
              <Link
                to="/hola"
                className="text-sm font-sans font-medium text-gray-600 underline"
              >
                ¿Olvidaste la Contraseña?
              </Link>
            </div>
            {/* <!-- Button --> */}
            <div className="text-sm font-sans font-medium w-full pr-20 pt-14">
              <button
                type="submit"
                className="text-center font-bold text-lg w-full py-3 bg-blue-500 hover:bg-red-300 duration-300 rounded-md text-white"
              >
                Ingresar
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
