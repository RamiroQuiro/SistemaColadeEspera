import React, { useState } from 'react'
import { NavLink,Link, Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar';
import {Auth} from '../context/ContextProvider';
import { signOut,getAuth } from 'firebase/auth';
import { app } from "../components/configFirebase";
import {FaUserAlt } from "react-icons/fa";
import'./sidebar.css'

export default function Layout() {
  const navigate=useNavigate()



const {user,profileUser,setProfileUser}= Auth()
const[ toggle , setToggle]=useState(true)



const auth = getAuth(app);
const handleLogOut=()=>{
 signOut(auth)
 setProfileUser({})
}

const handletoggle=()=>{

setToggle(!toggle)
}



  return (
    <div className="grid  grid-cols-7 grid-rows-1    ">

      <nav className="bg-zinc-800  sidebar min-h-full box border-r border-gray-300 ">
        <Sidebar />
      </nav>

      <main className="container col-auto grid box col-start-2 col-span-6">
        <div className="bg-gray-100 flex px-10 flex-col">
          <nav className=" navbar-expand  my-5">
            <div className="flex justify-between align  mx-auto w-full ">
              <div className="dropdown w-10/12 my-auto hover:scale-y-105 duration-200 nav-items">
               <h2 className="text-xl font-medium px-1 text-gray-800">Hola {profileUser.userName || user.email}</h2>
              </div>
              <div 
              onClick={handletoggle}
              className="  dropdown nav-items cursor-pointer   mx-auto">
                  <FaUserAlt  className="text-2xl text-slate-900 "/>
           <ul 
              // hidden={!toggle?true:false}
               className={ toggle? "hidden": "-ml-10 mt-3 duration-300 shadow-lg bg-opacity-90 cursor-pointer absolute h-10 border text-white flex px-4 border-gray-300 shadow-lg rounded-lg bg-slate-900"}>
                <button 
                onClick={handleLogOut}        
                className="hover:-translate-y-0.5 holver:font-bold duration-300 font-medium hover:text-red-200">Cerrar Sesion</button>
              </ul>
              </div>
            </div>
          </nav>
          <div className="rounded-lg  bg-white shadow-lg  w-full p-5 mx-auto mb-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
