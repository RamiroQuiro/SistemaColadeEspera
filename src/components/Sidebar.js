import React from 'react'
import { Link,} from 'react-router-dom'
import imgLogo from "../img/logoCepsi.png";
import { FaBeer } from 'react-icons/fa';
import { FiHome,FiMonitor,FiUsers,FiGitPullRequest, FiLayers } from "react-icons/fi";
import { FaWindowRestore,FaWindowMaximize,FaUserAlt } from "react-icons/fa";
import { MdDashboard} from "react-icons/md";
import RutaAdmin from './RutaAdmin';
import { Auth } from '../context/ContextProvider';


export default function Sidebar() {

  const {user,profileUser}=Auth()

  return (
   <>
    <img src={imgLogo} alt=""className="logoSidebar mx-auto w-2/3 my-9" />
      <hr />
        <div className="flex flex-col mx-auto my-9 justify-between w-full align-center gap-2 text-gray-100 font-medium">
          <div className="flex duration-200 block hover:bg-gray-50 hover:bg-opacity-20 active:text-blue-300 px-5 py-2  gap-3">
          <MdDashboard className="text-2xl"/>
          <Link to='/home'>Inicio</Link>{' '}</div>
          <div className="flex duration-200 block hover:bg-gray-50 hover:bg-opacity-20 active:text-blue-300 px-5 py-2  gap-3"><FaWindowMaximize className="text-xl"/><Link to='user'>Vista Atención</Link></div>
          {
            profileUser.rol==="admin"?<>
          <div className="flex duration-200 block hover:bg-gray-50 hover:bg-opacity-20 active:text-blue-300 px-5 py-2  gap-3"><FiLayers className="text-xl"/><Link to='listadeFilas'>Lista de Filas</Link>{' '}</div>
            <div className="flex duration-200 block hover:bg-gray-50 hover:bg-opacity-20 active:text-blue-300 px-5 py-2  gap-3"><FaWindowRestore className="text-xl"/><Link to='listadeVentanilla'>Lista de Ventanilla</Link>{' '}</div>
            <div className="flex duration-200 block hover:bg-gray-50 hover:bg-opacity-20 active:text-blue-300 px-5 py-2  gap-3"><FaUserAlt className="text-xl"/><Link to='users'>Usuarios</Link></div>
          </>: null
          }
        </div>
   </>
  )
}
