import React from 'react'
import {Auth} from '../context/ContextProvider'


export default function RutaAdmin({children}) {
    const {user}= Auth()
 

  
  if(user.role==='admin') return  <>{children}</>
  
    
}
