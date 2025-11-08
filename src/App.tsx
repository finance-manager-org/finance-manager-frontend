import { BrowserRouter, Routes, Route } from "react-router-dom";
import  LandingPage  from "./pages/LandingPage";
import  RegisterPage  from "./pages/RegisterPage";
import  LoginPage  from "./pages/LoginPage";
import React from "react";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
