import { useState,useEffect } from "react"
import {Link, useNavigate } from "react-router-dom";
import { Auth } from "../context/ContextProvider";

export default function CreateUser() {


    const [ user , setUser]=useState({
      userName:"",
            email: "",
            password: "",
            rol:"",
            ventanilla:"",
            box: "",
    });
const [error, setError] = useState("");
const[ventanillas,setVentanillas]= useState([])


    const {createUsers,resetPassword,traerVentanillas}=Auth()
    const navigate = useNavigate()

    const handleChange =({target: {name,value}})=>{
       setUser({...user,[name]:value});
    }

    const handleSubmit =  (e)=>{
            e.preventDefault();
             createUsers(user.email, user.password, user.rol,  user.ventanilla,user.box,user.userName)
            navigate(-1)
    
    }

    const handleResetPassword = async () =>{
        if(!user.email){
          setError('Por favor escribe tu email')
        }
        try {
          await resetPassword(user.email)
          setError('hemos enviado un correo con un enlace para resetear tu contraseña')
          
        } catch (error) {
          
          setError(error.message)
        }
    }

    useEffect(()=>{
      const traerVen=async()=>{
      const ventanillas=await traerVentanillas()
      console.log(ventanillas)
      setVentanillas(ventanillas)}
      traerVen()
    },[])
    return (
        <div className=" h-full mx-auto pt-9">
          <form 
            onSubmit={handleSubmit}
            className=" w-3/5 mx-auto hover:shadow-lg hover:-translate-y-1.5 duration-300 border rounded-lg  px-8  py-8 my-auto "
          >
            <div className="mb-4 inline-block w-1/2">
              {" "}
              <label
                htmlFor="userName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                {" "}
                Nombre de Usuario{" "}
              </label>
              <input
                type="text"
                name="userName"
                placeholder="Nombre de Usuario"
                className="shadow appearance-nonce rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleChange}
              />
            </div>
          
            <div className="mb-4 inline-block w-1/2">
              {" "}
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                {" "}
                Email{" "}
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@email.com"
                className="shadow appearance-nonce rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                {" "}
                Password{" "}
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="*******"
                className="shadow appearance-nonce rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 w-2/4 inline-block">
              <label
                htmlFor="ventanilla"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                {" "}
                Ventanilla{" "}
              </label>
              <select
            className="shadow appearance-nonce rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange}
              name="ventanilla" id="cola">
                {
                  ventanillas?.map(ventanilla =>(
                    <option value={ventanilla.nombre}>{ventanilla.nombre}</option>

                  ))
                } 
              </select>

            </div>
            <div className="mb-4 w-1/5 mx-3 inline-block ">
              <label
                htmlFor="rol"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                {" "}
                Rol{" "}
              </label>
              <select
            className="shadow appearance-nonce  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange}
              name="rol" id="rol">
                <option value="admin" >Admin</option>
                <option value="regular">Regular</option>
              </select>

            </div>
         
            <div className="flex items-center justify-between">
            <button 
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded focus:shadow-outline ">
              Registrar
            </button>
              <a href="#" onClick={handleResetPassword} className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded focus:shadow-outline ">
                Resablecer Contraseña
              </a>
            </div>
          </form>
          
       
        </div>
    );
}
