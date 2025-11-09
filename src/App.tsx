import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CalendarPage } from "./pages/CalendarPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { AccountsPage } from "./pages/AccountsPage";
import ProfilePage from "./pages/ProfilePage";
import { ArticlesPage } from "./pages/ArticlesPage";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Sidebar } from "./components/Sidebar";
import React from "react";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <DashboardPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <CalendarPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <CategoriesPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <AccountsPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <ProfilePage />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
