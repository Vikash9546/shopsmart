import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Adhere to premium development by adding more routes later */}
        <Route path="*" element={<div className="text-center py-20 text-gray-500 font-bold">404 | Page Coming Soon</div>} />
      </Routes>
    </Layout>
  );
}

export default App;
