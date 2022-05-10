import { updateEmail, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { db } from "../components/configFirebase";
import { Auth } from "../context/ContextProvider";

export default function CreateUser() {
  const params = useParams();
  const navigate = useNavigate()
  const docRef=doc(db,`usuarios/${params.uid}`)

  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
    rol: "",
    ventanilla: "",
    box: "",
  });
  const [error, setError] = useState("");
  const [ventanillas, setVentanillas] = useState([]);
  const[editUser,setEditUser]=useState(false)

  console.log(params.uid);

  const { createUsers, resetPassword, traerVentanillas } = Auth();

  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUsers(
      user.email,
      user.password,
      user.rol,
      user.ventanilla,
      user.userName
    );
    navigate(-1);
  };

  const handleResetPassword = async () => {
    updatePassword(user,user.password)
  };

  useEffect(() => {
    const traerVen = async () => {
      const ventanillas = await traerVentanillas();
      setVentanillas(ventanillas);
    };
    traerVen();
    // si params.uid tiene algo entonces trae el usuario y coloca en el estado USER
    params.uid&&busquedaDeUser()
  }, []);


//buscar usuario con el uid del useParams()

const busquedaDeUser=async () => {
  const data = await getDoc(docRef).then((data) => data.data())
  setUser(data)
}

// boton de modificar usuarios
const handleChangeUser =async(e)=> {
  e.preventDefault()
  await updateDoc(docRef,user).then(()=>{
    toast.success('Datos modificados correctamente')
    setTimeout(()=>{
      navigate(-1)
    },1200)
  }).catch(err=>{
    toast.error('Ocurrio algun problema, vuelva intentarlo')
    navigate(-1)
  })
}
  return (
    <>
    <div className=" h-full mx-auto pt-9">
    <Toaster/>
      <form
        onSubmit={params.uid? handleChangeUser:handleSubmit}
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
            value={params.uid?user.userName:null}
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
            value={params.uid?user.correo:null}
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
            name="ventanilla"
            id="cola"
            selected= {user.uid?
              user.ventanilla
              :
            null
            }
          >
            {ventanillas?.map((ventanilla) => (
              <option 
              
              value=
             {ventanilla.nombre}
              >
                {ventanilla.nombre}</option>
            ))}
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
          value={params.uid?user.rol:null}
            className="shadow appearance-nonce  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange}
            name="rol"
            id="rol"
          >
            <option value="admin">Admin</option>
            <option value="regular">Regular</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded focus:shadow-outline ">
            {
              params.uid?'Editar':'Registrar'
            }
            
          </button>
    
        </div>
      </form>
      
      <button 
      onClick={()=>navigate(-1)}
      className=" font-medium text-zinc-500 hover:text-zinc-700">◀ volver</button>
    </div>
      </>
  );
}
