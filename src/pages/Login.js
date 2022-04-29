import { useState } from "react"
// import {useAuth} from '../context/authContext'
import {Link, useNavigate } from "react-router-dom";
import  "./login.css";
// // import { Alert } from "./Alert";

export default function Login() {

    const [ user , setUser]=useState({
            email: "",
            password: "",
    });
const [error, setError] = useState("");


    // const {login,logingoogle,resetPassword}=useAuth()
    // const navigate = useNavigate()

    // const handleChange =({target: {name,value}})=>{
    //   //  setUser({...user,[name]:value});

    // }

    // const handleSubmit = async (e)=>{
    //         e.preventDefault();
    //         setError("")
    //         try {
    //         await login(user.email, user.password)
    //         navigate('/')
    //     } catch (error) {
    //         setError(error.message)
    //         console.log(error.code)
    //         if (error.code === "auth/invalid-email") {
    //           setError("formato de mail invalido");
    //         } else if (error.code === "auth/weak-password") {
    //           setError("formato de password incorrecto");
    //         }
    //     }
    // }

    // const handleGoogleSigIn = async()=>{
    //   try {
    //     await logingoogle()
    //     navigate('/')
        
    //   } catch (error) {
    //     setError(error.message)
    //   }
    // }

    // const handleResetPassword = async () =>{
    //     if(!user.email){
    //       setError('Por favor escribe tu email')
    //     }
    //     try {
    //       await resetPassword(user.email)
    //       setError('hemos enviado un correo con un enlace para resetear tu contraseña')
          
    //     } catch (error) {
          
    //       setError(error.message)
    //     }
    // }
    return (
      <div className="containerLogueo  ">
        <div className="w-50 m-auto bg-gray m-auto pt-9">
          <form
            onSubmit={'handleSubmit'}
            className=" bg-white rounded  px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
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
                onChange={'handleChange'}
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
                onChange={'handleChange'}
              />
            </div>
            
            <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded focus:shadow-outline ">
              Ingresar
            </button>
              <a href="#" onClick={'handleResetPassword'} className="inline-block font-bold text-blue-500 text-sm rounded py-2 px-4 focus:outline-none focus:shadow-outline-none">
                Olvide mi Contraseña
              </a>
            </div>
          </form>
        
          {/* {error ? <Alert message={error} /> : null} */}
        </div>
      </div>
    );
}
