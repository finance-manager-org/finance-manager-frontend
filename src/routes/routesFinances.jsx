import { BrowserRouter,Routes,Route } from 'react-router-dom';
import React from 'react';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { CalendarPage } from '../pages/CalendarPage';
import DashboardPage from '../pages/DashboardPage';
import { TagsPage } from '../pages/TagsPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { StatisticsPage } from '../pages/StatisticsPage';
import AccountsPage from '../pages/AccountsPage';
import CategoriesPage from '../pages/CategoriesPage';
import ProfilePage from '../pages/ProfilePage';
import { ProtectedRoute } from '../components/ProtectedRoute';

const RoutesPages = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LandingPage/>}/>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/register' element={<RegisterPage/>}/>
                <Route path='/dashboard' element={<ProtectedRoute><DashboardPage/></ProtectedRoute>}/>
                <Route path='/calendar' element={<ProtectedRoute><CalendarPage/></ProtectedRoute>}/>
                <Route path='/transactions' element={<ProtectedRoute><TransactionsPage/></ProtectedRoute>}/>
                <Route path='/categories' element={<ProtectedRoute><CategoriesPage/></ProtectedRoute>}/>
                <Route path='/accounts' element={<ProtectedRoute><AccountsPage/></ProtectedRoute>}/>
                <Route path='/tags' element={<ProtectedRoute><TagsPage/></ProtectedRoute>}/>
                <Route path='/statistics' element={<ProtectedRoute><StatisticsPage/></ProtectedRoute>}/>
                <Route path='/profile' element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesPages;