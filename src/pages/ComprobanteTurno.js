import React, { useEffect, useState } from "react";
import "./comprobanteTurno.css";
import logoCepsi from "../img/logoCepsi.png";
export default function ComprobanteTurno({turno}) {
  const [reloj, setReloj] = useState({
    horas: 0,
    minutos: 0,
    segundos: 0,
    diaSemana: 0,
    dia: 0,
    mes: 0,
    year: 0,
  });

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
  return (
    <div className="ticket mx-auto">
      <img className="imgTicket s mx-auto pb-2" src={logoCepsi} alt="Logotipo" />
      <p className="text-center">
        CePSI Eva Perón
        <br />
        Santiago del Estero
        <br />
        {`${reloj.dia}/${reloj.mes}/${reloj.year}`} | {`${reloj.horas}:${reloj.minutos}:${reloj.segundos}`}
      </p>
      <table className="mx-auto w-full text-center">
        <thead className="bg-gray-200 w-full mx-auto">
          <tr>
            <th className="text-sm">
              N°
              <br />
              Turno
            </th>
            <th className="text-sm">Servicios</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="cantidad">{turno?.nTurno}</td>
            <td className="producto">{turno?.fila}</td>
          </tr>
        </tbody>
      </table>
      <p className="footerTicket text-center mt-5  font-medium uppercase text-sm">
        ¡Turno otorgado!
     
        
      </p>
      <p className="footerTicket text-center font-medium uppercase text-sm">ramaCode.com</p>
    </div>
  );
}
