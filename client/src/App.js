import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Adhere to premium development by adding more routes later */}
        <Route path="*" element={<div className="text-center py-20 text-gray-500 font-bold">404 | Page Coming Soon</div>} />
      </Routes>
    </Layout>
  );
}

export default App;
