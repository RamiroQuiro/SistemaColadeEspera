import React, { useEffect, useState } from "react";
import "./visorFilas.css";
import { BiArrowFromLeft } from "react-icons/bi";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { doc, getDoc, onSnapshot, onSnapshotsInSync } from "firebase/firestore";
import { db } from "../components/configFirebase";
import { Auth } from "../context/ContextProvider";

export default function VisorFilas() {
  const { traerVentanillas, profileUser } = Auth();
  const params = useParams();
  const [turnos, setTurnos] = useState(null);
  const [atendiendoAhora, setAtendiendoAhora] = useState(false);
  const [ventanillas, setVentanillas] = useState(null);
  const [reloj, setReloj] = useState({
    horas: 0,
    minutos: 0,
    segundos: 0,
    diaSemana: 0,
    dia: 0,
    mes: 0,
    year: 0,
  });

  const semana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const atencionCollectionRef = doc(db, "box&filas", "atención");
  useEffect(() => {
    const obtenerHora = () => {
      const event = new Date();
      setReloj({
        horas: event.getHours(),
        minutos: event.getMinutes(),
        segundos: event.getSeconds(),
        diaSemana: event.getDay(),
        dia: event.getDate(),
        mes: event.getMonth(),
        year: event.getFullYear(),
      });
    };
    obtenerHora();
    setInterval(obtenerHora, 1000);
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "box&filas", "filas"), (consulta) => {
      const split = params.fila.split(",");
      const array = split.map((turno) => consulta.data()[turno]);
      setTurnos(array.reduce((accum, items) => accum.concat(items), []));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const traerAtendiendoAhora = async () => {
      const data = await getDoc(atencionCollectionRef);
      setAtendiendoAhora(
        data.data().atencion?.filter((turnos) => {
          const filtro = params.fila.split(",");
          return filtro.includes(turnos.fila);
        })
      );
    };
    traerAtendiendoAhora();
  }, [turnos]);

  useEffect(() => {
    const traerVen = async () => {
      const ventanillas = await traerVentanillas();
    };
    traerVen();
  }, []);

  return (
    <div className=" w-full h-screen flex align-center justify-center bg-gray-200 box-shado ">
      <div className="grid containerVisor z-50 bg-white rounded-lg shadow-lg  m-auto overflow-hidden grid-cols-3 grid-rows-1 gap-2">
        <div className="box col-start-1  col-end-2 border-r-2 text-gray-800 flex flex-col">
          <h1 className="text-xl font-bold py-1 mx-auto ">{params.fila}</h1>
          <h2 className="text-4xl font-medium mt-4 mx-auto border-b ">
            Atendiendo ahora
          </h2>
          <div className="flex gap-1 px-2 text-2xl mt-5 justify-around align-center">
            <div className=" w-2/6 text-center  font-medium  text-xl">
              <h2>N° Turno</h2>
            </div>
            <div className=" w-4/6 text-center  font-medium  text-3xl">
              <h2>Ventanilla</h2>
            </div>
          </div>
          <div className=" bg-red-500 uppercase rounded-r-lg  border-r-8 shadow-md my-2 flex justify-between border-green-500">
            <div className=" text-center mx-auto text-3xl font-medium">
              <div className="  font-bold px-4 py-9 rounded  text-5xl uppercase">
                <h2>{atendiendoAhora[atendiendoAhora.length - 1]?.nTurno} - {turnos &&
                    atendiendoAhora[atendiendoAhora.length - 1]?.ventanilla}</h2>
              </div>
            </div>
           
          </div>
          <div className="px-8 ">
            <div className="my-4 pl-4 border-b w-full">
              <h2 className="font-medium text-lg">Siguientes Turnos</h2>
            </div>
            {turnos ? (
              turnos
                .filter((turnos) => {
                  return params.fila.includes(turnos.fila);
                })
                .map((turnos, i) => (
                  <div className="ml-6 relative bg-red-300 bg-opacity-60 p-4 uppercase rounded-r-lg  border-r-8 shadow-md my-2 flex justify-between border-green-500">
                    <div className="absolute -left-8 top-5">
                      <div className="cursor-pointer bg-red-600 px-2 py-1  flex items-center text-2xl text-white justify-center">
                        <BiArrowFromLeft />
                      </div>
                    </div>
                    <div className="text-3xl font-medium pl-5">
                      <p>
                        {i} {turnos.nTurno}-{turnos.fila}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <h2>Loading...</h2>
            )}
          </div>
        </div>
        <div className="box col-start-2 col-end-4 relative">
          <div className="absolute inset-x-1/4 top-8  w-3/6 flex flex-col gap-2 ">
            <div className=" font-medium text-xl bg-gray-500  opacity-90 text-center text-white">
              {`${semana[reloj.diaSemana]} ${reloj.dia} de ${
                meses[reloj.mes]
              } del ${reloj.year}`}
              <br />
            </div>
            <div className=" font-medium text-4xl bg-gray-500  opacity-90 text-center text-white">
              {`${reloj.horas} : ${reloj.minutos} :  ${reloj.segundos}`}
            </div>
          </div>
          <ReactPlayer
            url="https://www.youtube.com/watch?v=s27Pb8b6i10"
            className="react-player"
            playing
            width="100%"
            height="100%"
            loop="true"
            controls="true"
          />
        </div>
      </div>
    </div>
  );
}
