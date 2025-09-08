//import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Settings from "./pages/Settings";

import AdminCurrencies from "./pages/AdminCurrencies";
import AdminHistory from "./pages/AdminHistory";
import Reports from "./pages/Reports";
import RequestExchange from "./pages/RequestExchange";
import RequestDetails from "./pages/RequestDetails";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/adminCurrencies" element={<AdminCurrencies />} />
        <Route path="/adminHistory" element={<AdminHistory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/requestExchange" element={<RequestExchange />} />
        <Route path="/requestDetails" element={<RequestDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
