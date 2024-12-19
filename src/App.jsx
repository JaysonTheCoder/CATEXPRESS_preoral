import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./styles/style.css"
import Homepage from "./pages/Homepage";
import OperatorM from './pages/OperatorM';
import Schedule from './pages/Schedule';
import Login from './pages/Authentication/Login';
import Signup from './pages/Authentication/Signup';
import { LogoutModal } from './pages/partials/Modal';
import Reports from './pages/Reports';
import React from 'react';
export default function App ()
{
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/home" element={ <Homepage/>}/>
          <Route path="/manage-users" element={ <OperatorM />}/>
          <Route path="/schedule" element={ <Schedule/>}/>
          <Route path="/reports" element={ <Reports />}/>
          <Route path="/" element={ <Login /> }/>
          <Route path="/signup" element={ <Signup />}/>
        </Routes>
      </Router>
    </React.Fragment>
  )
}
