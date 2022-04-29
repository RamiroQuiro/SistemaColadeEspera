import React from 'react'
import { Navigate } from 'react-router-dom'
import {Auth} from '../context/ContextProvider'


export default function PrivateRouter({children}) {
    const {user}= Auth()
    console.log(user)
  
    
  
  if(!user) return <Navigate to='/'/>
  
    return <>{children}</>
}
