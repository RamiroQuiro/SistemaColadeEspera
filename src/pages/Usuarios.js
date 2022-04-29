import { collection, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { db } from '../components/configFirebase';


export default function Usuarios() {

  const [ usersList , setUsersList]=useState([])
  const userCollection = collection(db,"usuarios")
 
const navigate = useNavigate()
    const handleCreateUsers = () => {
      navigate("createUser");
    };


useEffect(()=>{
  const getUsers = async() =>{
    const data =await getDocs(userCollection) 
    const array = [];
data.forEach((doc) => {
  array.push(doc.data())
  // doc.data() is never undefined for query doc snapshots
});
setUsersList(array);
  }
  getUsers()
},[])


  return (
    <div>
      <div className="flex w-full">
        <div className="dropdown w-10/12 mb-5 my-auto hover:scale-y-105 duration-200 nav-items">
          <form action="">
            <FiSearch className="  inline-block mr-2" />
            <input
              type="text"
              placeholder="`Buscar`"
              className="px-4 inline-block w-6/12 border  border-slate-300 hover:shadow-lg focus:ring focus:ring-rose-300 focus:outline-none duration-200 h-10 rounded-md"
            />
          </form>
        </div>
      
        <button 
        onClick={handleCreateUsers}
        className=" h-10  bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 focus:outline-none focus:ring focus:ring-cyan-300 rounded-lg p-2 text-white font-bold">
          Crear Usuarios
        </button>
    
      </div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Ventanilla
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
          </tr>
        </thead>

        <tbody className="bg-white">

         {

           !usersList?<span className="absolute font-bold text-2xl">Loading...</span>:
           usersList.map((user) =>(

           
          <tr 
          key={user.uid}
          className="hover:bg-gray-50 duration-300 cursor-pointer">
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                    alt=""
                  />
                </div>

                <div className="ml-4">
                  <div className="text-sm leading-5 font-medium text-gray-900">
                  { user.userName}
                  </div>
                  <div className="text-sm leading-5 text-gray-500">
                  {user.correo}
                  </div>
                </div>
              </div>
            </td>

            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="text font-bold text-center leading-5 text-gray-900">
                {user.ventanilla}
              </div>
            </td>

            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {user.active? "Active":'Inactive'}
              </span>
            </td>

            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
              {user.rol}
            </td>

            <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
              <a href="#" className="text-indigo-600 hover:text-indigo-900">
                Delet
              </a>
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
