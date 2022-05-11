# README.MD
El presente sistema esta pensado para dar un numero de espera e ingresar en una cola de espera fisica.


## Content
Con el comprobante en mano, el usuario final espera en el visor correspondiente que en la pantalla se visualize su N° de turno (que puede ser aleatorio o previa modificacion puede ser ascendente) y el nombre de la ventanilla.

### userVentanilla
Los usuarios que ingresan al sistema tienen dos roles, el rol del **Administrador** ; que es crear usuario, ventanilla y filas, resetaar filas si asi es necesario y un pequeño grafico de dias anteriores.
El usuario de rol **Regular**, tendar como secciones, su dashboar en donde vera su fila asignada, el nombre de su ventanilla , cuantas persoans tiene su fila a atender, y cuantas personas atendío el dia de hoy, su seccion de vista de atención se visualizara la cola de espera correspondiente y el numero de atencion actual. En caso de que el usuario tenga mas de una fila de atención se le agrego un filtro en donde puede filtrar que fila atendera a su conveniencia


## Demo
El demoLive del proyecto esta deployado en  [cola-de-espera.vercel.app](https://cola-de-espera.vercel.app/)


## Primeros Pasos
Para los primeros pasos Ingrese con el usuario **admin@admin.com** con la contraseña **administrador**.

* Cree primero las Filas
* Cree en segundo lugar las ventanillas y asigne la/las fila/s
* Cree el Usuario y le asigna la ventanilla que usted creo.

.
## Credenciales para el Demo

Administrador: admin@admin.com
    Contraseña: Administrador
Usuario Regular: atencion1@admin.com
    Contraseña: password

## Vista de Pantallas

**Pantalla de entrada para los usuarios**
![](/src/img/Login.png)

**Pantalla de para quien otorga los numeros**
![](/src/img/Turnero.png)

**Pantalla de Visor de Turnos**
En esta pantalla se podra elegir por Fila o podra personalizar por vairas filas de ser necesario
![](/src/img/Visor%20de%20Numeros.png)


## Tecnologias utilizadas

* ReactJs
* Tailwindcss
* ChartJS
* Firebase

