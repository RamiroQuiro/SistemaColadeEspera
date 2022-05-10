import { type } from "@testing-library/user-event/dist/type";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../components/configFirebase";
import { Auth } from "../context/ContextProvider";
import DatePicker, { Calendar, DateObject } from "react-multi-date-picker";
import SemanaChart from "./SemanaChart";
import { Link } from "react-router-dom";

export default function Home() {
  const { user, profileUser, traerVentanillas } = Auth();
  const [coladeEspera, setColadeEspera] = useState(false);
  const [colaDeEsperaDisponible, setColaDeEsperaDisponible] = useState(false);
  const [ventanillas, setVentanillas] = useState(false);
  const [disable, setDisable] = useState(false);
  const [ventanillasAdmin, setVentanillasAdmin] = useState(false);
  const [atendidos, setAtendidos] = useState(false);
  const [filas, setFilas] = useState(false);
  const [registro, setRegistro] = useState(false);
  const [reloj, setReloj] = useState({
    horas: 0,
    minutos: 0,
    segundos: 0,
    diaSemana: 0,
    dia: 0,
    mes: 0,
    year: 0,
  });
  const colasCollectionRef = doc(db, "box&filas", "filas");
  const atencionCollectionRef = doc(db, "box&filas", "atención");
  const registroCollectionRef = doc(db, "box&filas", "registro");

  // useEffect(() => {
  //     traerColaDeEspera().then((data) => {
  //         const array = Object.values(data);
  //         setColadeEspera(array?.reduce((accum, items) => accum.concat(items), []));
  //       });
  // },[])

  useEffect(() => {
    const unsub = onSnapshot(colasCollectionRef, (consulta) => {
      const arrays = Object.values(consulta.data());

      setColadeEspera(arrays.reduce((accum, items) => accum.concat(items), []));
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const obtenerHora = () => {
      const event = new Date();
      setReloj({
        horas: event.getHours(),
        minutos: event.getMinutes(),
        segundos: event.getSeconds(),
        diaSemana: event.getDay(),
        dia: event.getDate(),
        mes: event.getMonth() + 1,
        year: event.getFullYear(),
      });
    };
    obtenerHora();
    setInterval(obtenerHora, 1000);
  }, []);

  if (reloj.horas === 13 && (reloj.minutos === 55) & (reloj.segundos === 0)) {
    resetearYGuardarRegistro();
  }

  // guardar registro dle dia y resetean el array de atención

  const resetearYGuardarRegistro = async () => {
    const event = reloj.year + "-" + reloj.mes + "-" + reloj.dia;
    await updateDoc(registroCollectionRef, {
      atencionDia: arrayUnion({
        totalTurnos: atendidos?.length,
        dia: new Date(event),
      }),
    });
    await setDoc(atencionCollectionRef, { atencion: [] });
  };
  //
  // resetar cola de Turnos
  const resetColadeTurnos = async () => {
    await setDoc(colasCollectionRef, {});
  };

  // estado de checkeo de la Zona de Riesgo
  const onCheck = (e) => {
    setDisable(e.target.checked);
  };
  //
  useEffect(() => {
    const traerAtendiendoAhora = async () => {
      const data = await getDoc(atencionCollectionRef);
      profileUser.rol === "regular"
        ? setAtendidos(
            data
              .data()
              .atencion.filter(
                (turno) => turno.atencionUser === profileUser.userName
              )
          )
        : setAtendidos(data.data().atencion);
    };
    const traerFila = async () => {
      const data = await getDoc(doc(db, "box&filas", "filas&box"));
      setFilas(data.data().filas);
      setVentanillasAdmin(data.data().Ventanilla);
    };
    const traerRegistro = async () => {
      const data = await getDoc(registroCollectionRef);
      setRegistro(data.data().atencionDia);
    };
    traerRegistro();
    traerFila();
    traerAtendiendoAhora();
  }, [coladeEspera]);

  useEffect(() => {
    traerVen().then((data) => {
      setVentanillas(data);
    });
  }, [coladeEspera]);

  useEffect(() => {
    coladeEspera && cargarcoladeespera();
  }, [coladeEspera, ventanillas]);

  const traerVen = async () => {
    const ventanillas = await traerVentanillas();
    return ventanillas.filter(
      (ventanilla) => ventanilla.nombre === profileUser.ventanilla
    );
  };

  const cargarcoladeespera = () => {
    setColaDeEsperaDisponible(
      coladeEspera?.filter((turno) =>
        ventanillas[0]?.servicios?.includes(turno.fila)
      )
    );
  };

  return (
    <div className="flex-1 mx-auto    pb-0 overflow-x-hidden overflow-y-auto">
      <div className="flex w-full justify-around items-center">
        <h3 className="text-gray-700 text-xl font-medium">
          Nombre de la Ventanilla :
        </h3>
        {profileUser?.rol === "regular" ? (
          <span className="text-red-400 text-2xl font-bold">
            {ventanillas ? ventanillas[0]?.nombre : `---`}
          </span>
        ) : (
          <>
            <h1 className="text-red-400 text-2xl font-bold"> Administrador</h1>
            <div className="flex gap-2 justify-around items-center bg-gray-200 bg-opacity-75 px-5 py-2 shadow-sm rounded-md ">
              <label htmlFor="pantallas" className=" font-medium text-sm  uppercase ">pantallas ▶</label>
              <Link 
              className="text-blue-400 hover:text-blue-600 duration-200 text-xl font-medium"
              to="/turnero" target="_blank">
              | Pantalla |
              </Link>
              <Link 
              className="text-blue-400 hover:text-blue-600 duration-200 text-xl font-medium"
              to="/visor" target="_blank">
               | Visor de Turnos |
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="mt-4">
        {profileUser?.rol === "regular" ? (
          <div className="flex flex-wrap -mx-6">
            <div className="w-full mt-6 py-3 px-3 sm:w-1/2 xl:w-1/3 sm:mt-0">
              <div className="flex items-center bg-gray-200 bg-opacity-75 px-5 py-6 shadow-sm rounded-md bg-white">
                <div className="p-3 rounded-full bg-red-300 ">
                  <div className="text-2xl">💼</div>
                </div>

                <div className="mx-5">
                  <div className="text-gray-700 text-xl font-medium">
                    Fila Asignada:
                  </div>
                  {ventanillas[0]?.servicios?.map((ventanilla) => (
                    <h4 className="text font-medium  text-gray-700">
                      ✔ {ventanilla}
                    </h4>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full py-3 px-3 sm:w-1/2 xl:w-1/3">
              <div className="flex bg-gray-200 bg-opacity-75 items-center px-5 py-6 shadow-sm rounded-md bg-white">
                <div className="p-3  rounded-full bg-indigo-600 bg-opacity-75">
                  <svg
                    className="h-8 w-8 text-white"
                    viewBox="0 0 28 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.2 9.08889C18.2 11.5373 16.3196 13.5222 14 13.5222C11.6804 13.5222 9.79999 11.5373 9.79999 9.08889C9.79999 6.64043 11.6804 4.65556 14 4.65556C16.3196 4.65556 18.2 6.64043 18.2 9.08889Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M25.2 12.0444C25.2 13.6768 23.9464 15 22.4 15C20.8536 15 19.6 13.6768 19.6 12.0444C19.6 10.4121 20.8536 9.08889 22.4 9.08889C23.9464 9.08889 25.2 10.4121 25.2 12.0444Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M19.6 22.3889C19.6 19.1243 17.0927 16.4778 14 16.4778C10.9072 16.4778 8.39999 19.1243 8.39999 22.3889V26.8222H19.6V22.3889Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M8.39999 12.0444C8.39999 13.6768 7.14639 15 5.59999 15C4.05359 15 2.79999 13.6768 2.79999 12.0444C2.79999 10.4121 4.05359 9.08889 5.59999 9.08889C7.14639 9.08889 8.39999 10.4121 8.39999 12.0444Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M22.4 26.8222V22.3889C22.4 20.8312 22.0195 19.3671 21.351 18.0949C21.6863 18.0039 22.0378 17.9556 22.4 17.9556C24.7197 17.9556 26.6 19.9404 26.6 22.3889V26.8222H22.4Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M6.64896 18.0949C5.98058 19.3671 5.59999 20.8312 5.59999 22.3889V26.8222H1.39999V22.3889C1.39999 19.9404 3.2804 17.9556 5.59999 17.9556C5.96219 17.9556 6.31367 18.0039 6.64896 18.0949Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <div className="mx-5">
                  <div className="text-gray-700 text-xl font-medium">
                    Tu cola de Espera
                  </div>
                  {colaDeEsperaDisponible ? (
                    <h4 className="text-2xl font-semibold text-gray-800">
                      📄 {colaDeEsperaDisponible?.length}
                    </h4>
                  ) : (
                    <svg
                      role="status"
                      className=" px-5 py-5 mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full mt-6 py-3 px-3 sm:w-1/2 xl:w-1/3 sm:mt-0">
              <div className="flex items-center bg-gray-200 bg-opacity-75 px-5 py-6 shadow-sm rounded-md bg-white">
                <div className="p-3 rounded-full  bg-orange-600 bg-opacity-75">
                  <div className="text-xl">👥</div>
                </div>

                <div className="mx-5">
                  <div className="text-gray-700 text-xl font-medium">
                    Total Cola de Espera
                  </div>
                  {coladeEspera ? (
                    <h4 className="text-2xl font-semibold text-gray-800">
                      📑 {coladeEspera?.length}
                    </h4>
                  ) : (
                    <svg
                      role="status"
                      className=" px-5 py-5 mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full py-3 px-3 sm:w-1/2 xl:w-1/3">
              <div className="flex bg-gray-200 bg-opacity-75 items-center px-5 py-6 shadow-sm rounded-md bg-white">
                <div className="p-3  rounded-full bg-indigo-600 bg-opacity-75">
                  <div className="text-2xl">📆</div>
                </div>
                <div className="mx-5">
                  <div className="text-gray-700 text font-medium">
                    Tus Atenciones hasta ahora en el día de Hoy
                  </div>
                  {atendidos ? (
                    <h4 className="text-2xl font-semibold text-gray-800">
                      📝 {atendidos?.length}
                    </h4>
                  ) : (
                    <svg
                      role="status"
                      className=" px-5 py-5 mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap -mx-6">
            <div className="w-full mt-6 py-3 pb-0 px-3 sm:w-1/2 xl:w-1/3 sm:mt-0">
              <div className="flex items-center bg-gray-200 bg-opacity-75 px-5 py-6 shadow-sm rounded-md bg-white">
                <div className="p-3 rounded-full  bg-orange-600 bg-opacity-75">
                  <div className="text-xl">👥</div>
                </div>
                <div className=" flex gap-2 flex-col">
                  <div className="mx-5">
                    <div className="text-gray-700 text-xl font-medium">
                      Total Cola de Espera
                    </div>
                    {coladeEspera ? (
                      <h4 className="text-2xl font-semibold text-gray-800">
                        📑 {coladeEspera?.length}
                      </h4>
                    ) : (
                      <svg
                        role="status"
                        className=" px-5 py-5 mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-500"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="mx-5">
                    <div className="text-gray-700 text-xl font-medium">
                      Total Atendido Hoy
                    </div>
                    {ventanillasAdmin ? (
                      <>
                        <h4 className="text-2xl font-semibold text-gray-800">
                          📑 {atendidos?.length}
                        </h4>
                      </>
                    ) : (
                      <svg
                        role="status"
                        className=" px-5 py-5 mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-500"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mt-6 py-3 px-3 sm:w-1/2 xl:w-1/3 sm:mt-0">
              <div className="flex items-center bg-gray-200 bg-opacity-75 px-5 py-6 shadow-sm rounded-md bg-white">
                <div className="p-3 rounded-full  bg-orange-600 bg-opacity-75">
                  <div className="text-xl">👥</div>
                </div>
                <div className="mx-5">
                  <div className="text-gray-700 text-xl font-medium">
                    Total de Filas
                  </div>
                  {filas ? (
                    <>
                      <h4 className="text-2xl font-semibold text-gray-800">
                        📑 {filas?.length}
                      </h4>

                      <ul className="font-medium text-sm pl-3">
                        {filas.map((fila) => (
                          <li>▶ {fila}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <svg
                      role="status"
                      className=" px-5 py-5 mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full mt-6 py-3 px-3 sm:w-1/2 xl:w-1/3 sm:mt-0">
              <div className="flex items-center bg-gray-200 bg-opacity-75 px-5 py-6 shadow-sm rounded-md bg-white">
                <div className="p-3 rounded-full  bg-orange-600 bg-opacity-75">
                  <div className="text-xl">👥</div>
                </div>
                <div className="mx-5">
                  <div className="text-gray-700 text-xl font-medium">
                    Total de Ventanillas
                  </div>
                  {ventanillasAdmin ? (
                    <>
                      <h4 className="text-2xl font-semibold text-gray-800">
                        📑 {ventanillasAdmin?.length}
                      </h4>

                      <ul className="font-medium text-sm pl-3">
                        {ventanillasAdmin?.map((ventanilla) => (
                          <li>▶ {ventanilla.nombre}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <svg
                      role="status"
                      className=" px-5 py-5 mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full mt-6 mx-auto  py-3 px-3 sm:mt-0">
              <div className="flex justify-center  items-center bg-gray-200 bg-opacity-75 px-5 py-6 shadow-sm rounded-md bg-white">
                <div className="w-full mx-auto">
                  <div className="text-gray-700 text-xl font-medium">
                    Registro Semanal
                  </div>

                  {registro ? (
                    <SemanaChart registro={registro} />
                  ) : (
                    <span>Loading...</span>
                  )}
                </div>
              </div>
            </div>

            <hr />
            <hr className="my-4" />
            <div className="flex flex-col w-full  border-t-4 border-zinc-700 items-center bg-gray-200 bg-opacity-75 mt-5 mb-0 px-2 py-4 shadow-sm rounded-md bg-red-100">
              <label className="font-bold text-sm  uppercase text-red-900">
                zona de riesgo
                <input
                  type="checkbox"
                  onClick={onCheck}
                  name="riesgo"
                  id="riesgo"
                  className="mx-2"
                />
              </label>
              <div className="flex text-sm  w-full justify-around items-center">
                <button
                  disabled={!disable ? true : false}
                  className="disabled:opacity-25 bg-red-500 px-4 py-2 font-medium text-gray-50 rounded hover:shadow-md duration-200  active:bg-red-600 active:rounded-lg active:translate-y-0.5"
                  onClick={resetearYGuardarRegistro}
                >
                  Restear cola de Atedidos
                </button>
                <button
                  disabled={!disable ? true : false}
                  className="disabled:opacity-25 bg-red-500 px-4 py-2  font-medium text-gray-50 rounded hover:shadow-md duration-200  active:bg-red-600 active:rounded-lg active:translate-y-0.5"
                  onClick={resetColadeTurnos}
                >
                  Restear cola de Turnos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
