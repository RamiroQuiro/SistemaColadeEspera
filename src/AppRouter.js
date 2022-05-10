import './App.css';
import {  Routes, Route } from 'react-router-dom';
import Layout from "./components/Layout";
import Visor from "./pages/Visor";
import LoginCornejo from "./pages/LoginDos";
import Home from "./pages/Home";
import Users from "./pages/Usuarios";
import PrivateRouter from './components/PrivateRouter';
import Turnero from './pages/Turnero';
import CreateUser from './pages/CreateUsers';
import UserPage from "./pages/UserPage";
import ListadeFilas from './pages/ListadeFilas';
import ListadeVentanilla from './pages/ListadeVentanilla';
import VisorFilas from './pages/VisorFilas';
import ComprobanteTurno from './pages/ComprobanteTurno';
import { Auth } from './context/ContextProvider';
import SemanaChart from './pages/SemanaChart';

function App() {

  const {profileUser}= Auth()
  return (
    <Routes>
      <Route path="/semanaChart" element={<SemanaChart />} />
      <Route path="/" index element={<LoginCornejo />} />
      <Route path="/turnero" element={<Turnero/>} />
      <Route path="/comprobante" element={<ComprobanteTurno/>} />
      <Route path="/visor" element={<Visor />} >
      </Route>
          <Route path="/visor/:fila" element={<VisorFilas/>}/>
      <Route path="/home" element={<PrivateRouter>  <Layout /></PrivateRouter>}>
        <Route path="/home" element={<Home />}/>
        <Route path="user" element={<UserPage />}/>
        <Route path="users" element={profileUser.rol==="admin"? <Users />:<Home/>} />
        <Route path="listadeFilas" element={profileUser.rol==="admin"? <ListadeFilas />:<Home/>}/>
        <Route path="listadeVentanilla" element={profileUser.rol==="admin"? <ListadeVentanilla />:<Home/>}/>
        
        <Route path="users/createUser" element={profileUser.rol==="admin"? <CreateUser />:<Home/>}/>
      </Route>
    </Routes>
  );
}

export default App;
