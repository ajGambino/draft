import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Draft from './components/Draft';
import Live from './components/Live';
import Login from './components/Login';
import Lobby from './components/Lobby';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/live" element={<Live />} />
        <Route path="/draft" element={<Draft />} />
        <Route path="/lobby" element={<Lobby />} />
      </Routes>
    </Router>
  );
}

export default App;
