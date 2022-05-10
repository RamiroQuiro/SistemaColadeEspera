
import React from 'react'

const atendiendoAhora = ({fila,nTurno,handleDeleteTurnos,atendiendoAhora}) => {


    
    const funccion=()=>{
        handleDeleteTurnos(fila,nTurno)
    }
  return (
    <div className="flex justify-between  flex-col bg-white w-1/2  border border-blue-200 rounded-lg h-5/6 hover:shadow-lg duration-300 px-5 pt-6 pb-8">
    <h1 className="card-body-titulo my-2 text-4xl font-bold text-red-500 text-center">
      Atendiendo Ahora
    </h1>
    <div className="bg-blue-400  text-center my-1 px-3 py-2 rounded shadow-md">
      <h2 className="inline-block font-medium text-2xl mx-4">Fila :</h2>
      <h2 className="inline-block mx-4 text-3xl font-bold">
         {
        atendiendoAhora[atendiendoAhora.length-1]?.fila
          } 
      </h2>
    </div>
    <div className="">
      <h2 className=" text-8xl my-4 font-bold text-center">
        {atendiendoAhora[atendiendoAhora.length-1]?.nTurno}
      </h2>
      <hr />
      {
        <h2 className="card-body-numero my-4 font-medium text-4xl text-center">
          {atendiendoAhora[atendiendoAhora.length-1]?.nombre}
        </h2>
      }
    
      <hr />
    </div>

    <button
      id="onClick"
      onClick={funccion}
      className="mt-6 uppercase hover:-translate-y-1 hover:scale-104 hover:bg-red-200 duration-300 align-center bg-gray-100 border-1 h-8 rounded shadow-slate-400"
    >
      atender siguiente
    </button>
  </div>
  )
}

export default atendiendoAhora