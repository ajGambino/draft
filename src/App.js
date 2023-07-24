import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Draft from './components/Draft';
import Live from './components/Live';
import Login from './components/Login';
import Lobby from './components/Lobby';
import Navbar from './components/Navbar';
import CreateContest from './components/CreateContest';



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/live" element={<Live />} />
        <Route path="/draft/:contestID" element={<Draft />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/create" element={<CreateContest />} />
      </Routes>
    </Router>
  );
}

export default App;
