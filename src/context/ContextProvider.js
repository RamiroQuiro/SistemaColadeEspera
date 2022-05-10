import React, {createContext, useContext, useEffect, useState} from 'react'
import { app, db } from "../components/configFirebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";

import { useNavigate } from 'react-router-dom';
import { doc, setDoc,collection, addDoc ,getDocs,  getDoc, documentId, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { async } from '@firebase/util';
import { v4 as uuidv4 } from 'uuid';


const AuthContext = createContext()

export const Auth=()=>{
  const contexto = useContext(AuthContext);
  return contexto
}


// --
export default function ContextProvider({children}) {
const useAuth = getAuth(app)

const [user,setUser]=  useState(null)
const [profileUser,setProfileUser]=  useState({})
const [ventanillas,setVentanillas]= useState([])
const [contador,setContador] =useState(1)


const boxCollectionRef = doc(db,"box&filas","filas&box")
const filasCollectionRef = doc(db,"box&filas","filas")
const colasCollectionRef = doc(db,"colas","turnos")


const login = (email, password) =>
signInWithEmailAndPassword(useAuth, email, password);

const createUsers= async(email, password,rol,ventanilla,box ,userName) =>{
  const infoUser= await createUserWithEmailAndPassword(useAuth,email,password).then((usuarioFirebase)=>{
    return usuarioFirebase
  });
// crear perfil en la collecion de FireSotre
  const docRef=doc(db,`usuarios/${infoUser.user.uid}`);
  setDoc(docRef,{
    userName:userName,
    correo:email,
    rol:rol,
    ventanilla:ventanilla,
    box:box,
    uid:infoUser.user.uid
  })
};

/// profile User
 const traerProfileUser= async (uid) => {

    const docRef=doc(db,`usuarios/${uid}`)
    const docu= await getDoc(docRef)
    const infoFinal=docu.data();
    setProfileUser(infoFinal)
}

// traer Usuarios
const borrarUsuario=(uid)=>{
  const user = useAuth.uid;
  deleteUser(uid)
  console.log(uid)
}

// crear Filas
const crearFila= async (fila)=>{
  await updateDoc(boxCollectionRef,{filas:arrayUnion(fila)})
}
const borrarFila= async (fila)=>{
  await updateDoc(boxCollectionRef,{filas:arrayRemove(fila)})
}

//crearVentanilla
const crearVentanilla= async (ventanilla)=>{
  await updateDoc(boxCollectionRef,{Ventanilla:arrayUnion(ventanilla) })
}
const traerVentanillas = async()=>{
  const ventanillas=await getDoc(boxCollectionRef)
  const data= ventanillas.data().Ventanilla
  return data
}

const borrarVentanilla = async (ventanilla)=>{
  const consulta =await getDoc(boxCollectionRef)
  const info=consulta.data().Ventanilla
  await updateDoc(boxCollectionRef,{Ventanilla:arrayRemove(info.find(buscado=>buscado.nombre===ventanilla))})
}

//crearTturnos
const crearTurno= async (fila,stateTurnero)=>{
const data=await getDoc(filasCollectionRef).then((data)=>{
  return data
}) 
const datos=data?.data()[fila]
!datos||!data.data()||datos.length===0? await updateDoc(filasCollectionRef,{
  [fila]: arrayUnion(stateTurnero)
}):
  await updateDoc(filasCollectionRef,{
     [fila]: arrayUnion({...stateTurnero})
 })
   return true
  //  nTurno:datos[datos.length-1].nTurno+1
}



// traer turnos

const traerTurnos=async ()=>{
  const data=await getDoc(colasCollectionRef)
  const info=data.data().turnos
console.log( info.filter(turno=>ventanillas?.servicios?.filter.includes(turno.fila)))
return data
}


useEffect(() => {
  const unsubscribe =  onAuthStateChanged(useAuth, (currentUser) => {
    console.log( currentUser);
    setUser(currentUser);
    traerProfileUser(currentUser.uid)

  });
  return ()=> unsubscribe()
},[useAuth])



  return <AuthContext.Provider value={{borrarFila,
    traerTurnos,
  borrarVentanilla,
  boxCollectionRef, 
  traerVentanillas,
  crearVentanilla,
  crearFila,login,
  profileUser,
  setProfileUser,
  user,
  borrarUsuario,
  crearTurno,createUsers}}>

    {children}
  </AuthContext.Provider>
}
